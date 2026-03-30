import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import paymentService from "@/services/paymentService";
import { fetchMe, selectUser } from "@/features/auth/authSlice";
import axios from "axios";

function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) { resolve(true); return; }
        const s  = document.createElement("script");
        s.src    = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload  = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });
}

export function useCheckout(courseId) {
    const navigate = useNavigate();
    const user     = useSelector(selectUser);
    const dispatch = useDispatch();

    const [course,  setCourse]  = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [method,  setMethod]  = useState("razorpay");
    const [paying,  setPaying]  = useState(false);
    const [usdAmount, setUsdAmount] = useState(null);
    const [inrAmount, setInrAmount] = useState(null);

    // ── Fetch course ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (!courseId) { navigate("/courses"); return; }
        if (!user)     { navigate("/login");   return; }

        const fetchCourse = async () => {
            try {
                setLoading(true);
                const cached = sessionStorage.getItem(`course_${courseId}`);
                if (!cached) {
                    setError("Course not found. Please go back and try again.");
                    return;
                }
                setCourse(JSON.parse(cached));
            } catch (err) {
                setError("Failed to load course");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, user, navigate]);

    // ── Currency conversion for PayPal ───────────────────────────────────────
    useEffect(() => {
        if (method !== "paypal" || !course) return;
        
        const fetchRate = async () => {
            try {
                const { data } = await axios.get(
                    "https://api.frankfurter.app/latest?from=INR&to=USD"
                );
                const rate = data.rates.USD;
                setUsdAmount(Number((course.price * rate).toFixed(2)));
            } catch {
                setUsdAmount(null);
            }
        };
        fetchRate();
    }, [method, course]);

    // ── INR conversion for Razorpay ───────────────────────────────────────
    useEffect(() => {
        if (method !== "razorpay" || !course) return;

        const fetchRate = async () => {
            try {
                const { data } = await axios.get(
                    "https://api.frankfurter.app/latest?from=USD&to=INR"
                );
                const rate = data.rates.INR;
                setInrAmount(Number((course.price * rate).toFixed(2)));
            } catch {
                setInrAmount(Math.round(course.price * 84.5));
            }
        };
        fetchRate();
    }, [method, course]);

    // ── Razorpay ───────────────────────────────────────────────────────────────
    const payRazorpay = async () => {
        const loaded = await loadRazorpayScript();
        if (!loaded) { toast.error("Razorpay SDK failed to load"); return; }

        const tid = toast.loading("Creating order...");
        try {
            const { data } = await paymentService.razorpayCreateOrder({ course_id: course.id });
            const { payment_id, razorpay_order_id, amount, currency, key_id } = data.data;
            toast.dismiss(tid);

        return new Promise((resolve, reject) => {
            const rzp = new window.Razorpay({
                key:         key_id,
                amount:      Math.round(amount * 100),
                currency,
                name:        "Certazy",
                description: course.title,
                order_id:    razorpay_order_id,
                prefill:     { name: user.name, email: user.email },
                theme:       { color: "#3282B8" },

                handler: async (response) => {
                    const vtid = toast.loading("Verifying payment...");
                    try {
                        await paymentService.razorpayVerify({
                            payment_id,
                            razorpay_order_id:   response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature:  response.razorpay_signature,
                        });
                        toast.dismiss(vtid);
                        resolve();
                    } catch (err) {
                        toast.dismiss(vtid);
                        reject(err);
                    }
                },
                modal: { ondismiss: () => reject(new Error("cancelled")) },
            });
            rzp.on("payment.failed", () => reject(new Error("Payment failed")));
            rzp.open();
        });
        } catch (err) {
            toast.dismiss(tid);
            throw new Error(err.response?.data?.message || "Razorpay order creation failed");
        }
    };

    // ── PayPal ─────────────────────────────────────────────────────────────────
    const payPaypal = async () => {
        const tid = toast.loading("Creating PayPal order...");
        try {
            const { data } = await paymentService.paypalCreateOrder({ course_id: course.id });
            const { payment_id, paypal_order_id } = data.data;
            toast.dismiss(tid);

            const baseUrl = import.meta.env.VITE_PAYPAL_MODE === "live"
                ? "https://www.paypal.com/checkoutnow"
                : "https://www.sandbox.paypal.com/checkoutnow";

            const win = window.open(
                `${baseUrl}?token=${paypal_order_id}`,
                "PayPal",
                "width=600,height=700,left=400,top=100"
            );

            return new Promise((resolve, reject) => {
                const poll = setInterval(async () => {
                    if (!win?.closed) return;
                    clearInterval(poll);
                    const ctid = toast.loading("Confirming payment...");
                    try {
                        await paymentService.paypalCapture({ payment_id, paypal_order_id });
                        toast.dismiss(ctid);
                        resolve();
                    } catch (err) {
                        toast.dismiss(ctid);
                        reject(err);
                    }
                }, 1000);
            });
        } catch (err) {
            toast.dismiss(tid);
            throw new Error(err.response?.data?.message || "PayPal order creation failed");
        }
    };

    // ── Main pay handler ───────────────────────────────────────────────────────
    const handlePay = async () => {
        setPaying(true);
        try {
            if (method === "razorpay") await payRazorpay();
            else await payPaypal();

            toast.success("Payment successful! 🎉");
            await dispatch(fetchMe());
            navigate(`/student/course/${course.id}/learn`);
        } catch (err) {
            if (err.message !== "cancelled") {
                toast.error(err.response?.data?.message || err.message || "Payment failed");
            }
        } finally {
            setPaying(false);
        }
    };

    return { course, loading, error, method, setMethod, paying, handlePay, inrAmount };
}