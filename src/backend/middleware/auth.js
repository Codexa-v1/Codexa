// auth.js
import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

// Middleware to verify Auth0 JWT token
export const verifyToken = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
  requestProperty: "user",
});

// Error handler for JWT verification
export const handleAuthError = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Invalid token",
      message: err.message,
    });
  }
  next(err);
};
