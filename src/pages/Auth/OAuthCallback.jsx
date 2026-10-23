import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMe } from "@/features/auth/authSlice";

/**
 * OAuthCallback.jsx
 * Route: /oauth/callback
 *
 * Google/GitHub login ke baad backend yahan redirect karta hai.
 * Hum /auth/me call karke user fetch karte hain — cookie already set ho chuki hai.
 * Phir role ke hisaab se redirect karte hain.
 */
export default function OAuthCallback() {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const result = await dispatch(fetchMe()).unwrap();
                const role   = result.user?.role;

                // Role based redirect
                if (role === "admin" || role === "sub_admin") {
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    navigate("/student/dashboard", { replace: true });
                }
            } catch {
                // fetchMe fail — token invalid
                navigate("/login?error=oauth_failed", { replace: true });
            }
        };

        handleCallback();
    }, []);

    return (
        <div style={{
            minHeight: "100vh", display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "#F1F5F9",
        }}>
            <div style={{ textAlign: "center" }}>
                {/* Spinner */}
                <div style={{
                    width: "40px", height: "40px",
                    border: "3px solid #E2E8F0",
                    borderTopColor: "#3282B8",
                    borderRadius: "50%",
                    margin: "0 auto 16px",
                    animation: "spin 0.7s linear infinite",
                }} />
                <p style={{ fontSize: "14px", color: "#64748B", fontWeight: 500 }}>
                    Signing you in...
                </p>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}