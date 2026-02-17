const jwt = require("jsonwebtoken");
require("dotenv").config();

const user = {
    id: 1,
    email: "test@example.com",
    role: "user"
};

const secret = process.env.JWT_SECRET;
console.log("JWT_SECRET available:", !!secret);
if (secret) {
    console.log("JWT_SECRET length:", secret.length);
    console.log("JWT_SECRET first 5 chars:", secret.substring(0, 5));
    console.log("JWT_SECRET last 5 chars:", secret.substring(secret.length - 5));
}

if (!secret) {
    console.error("JWT_SECRET is not defined in .env");
    process.exit(1);
}

const token = jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role
}, secret, { expiresIn: "1h" });

console.log("Generated Token:", token);

try {
    const decoded = jwt.verify(token, secret);
    console.log("Immediate Verification Success:", decoded);
} catch (err) {
    console.error("Immediate Verification Failed:", err.message);
}

// Test with invalid secret
try {
    jwt.verify(token, "wrong-secret");
} catch (err) {
    console.log("Verification with wrong secret failed as expected:", err.message);
}

// Check for expiration specifically
const expiredToken = jwt.sign({ id: 1 }, secret, { expiresIn: "0s" });
try {
    jwt.verify(expiredToken, secret);
} catch (err) {
    console.log("Verification of expired token failed as expected:", err.message);
}
