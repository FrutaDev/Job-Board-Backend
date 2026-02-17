const { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } = require("../../auth/token.service");
require("dotenv").config();

const user = {
    id: 123,
    email: "test@example.com",
    role: "user"
};

console.log("--- Testing Token Service ---");

const accessToken = generateToken(user);
console.log("Access Token generated");

try {
    const decodedAccess = verifyToken(accessToken);
    console.log("Access Token Verification: SUCCESS", decodedAccess.id === user.id ? "(ID Matches)" : "(ID DESMATCH!)");
} catch (err) {
    console.error("Access Token Verification: FAILED", err.message);
}

const refreshToken = generateRefreshToken(user);
console.log("Refresh Token generated");

try {
    // This should now succeed with the correct secret
    const decodedRefresh = verifyRefreshToken(refreshToken);
    console.log("Refresh Token Verification: SUCCESS", decodedRefresh.id === user.id ? "(ID Matches)" : "(ID DESMATCH!)");
} catch (err) {
    console.error("Refresh Token Verification: FAILED", err.message);
}

// Verify that verifyToken fails for refresh tokens (as they use different secrets)
try {
    verifyToken(refreshToken);
    console.log("Cross-verification (Access using Refresh): FAILED (Should have thrown)");
} catch (err) {
    console.log("Cross-verification (Access using Refresh): SUCCESS (Threw as expected:", err.message, ")");
}

console.log("\n--- Verification Complete ---");
