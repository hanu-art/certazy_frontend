import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";

/**
 * rootReducer.js
 *
 * Saare Redux slices yahan combine hote hain.
 * Naya slice banao → yahan add karo — bas.
 *
 * Current slices:
 *   auth → user, accessToken, isLoggedIn, isFirstLogin
 *
 * Aage add honge:
 *   category    → categories list (mega menu)
 *   course      → filters, search, current course
 *   cart        → checkout state
 *   notification → notifications, unreadCount
 */

const rootReducer = combineReducers({
    auth: authReducer,

    // Aage yahan add karte jayenge:
    // category:     categoryReducer,
    // course:       courseReducer,
    // cart:         cartReducer,
    // notification: notificationReducer,
});

export default rootReducer;