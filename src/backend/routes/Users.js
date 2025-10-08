// src/backend/routes/Users.js
import express from 'express';
import { ManagementClient } from 'auth0';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize Auth0 Management Client
const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: "read:users update:users",
});

// Helper to decode URL-encoded userId
function decodeUserId(userId) {
  return decodeURIComponent(userId);
}

// GET /api/users/:userId - Get user profile
// GET /api/users/:userId - Get user profile
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    // Decode URL-encoded userId from route
    const userId = decodeURIComponent(req.params.userId);
    console.log("Requested userId:", userId);
    console.log("Authenticated user:", req.user);

    // Verify token has read:users scope
    if (!req.user.scope?.includes("read:users")) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Auth0 ManagementClient expects { id: string }
    const user = await management.users.get( userId );

    res.json({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      picture: user.picture,
      user_metadata: user.user_metadata || {},
      app_metadata: user.app_metadata || {},
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    // Send detailed error if Auth0 returns it
    if (error.response) {
      return res.status(error.statusCode || 500).json({
        error: error.error || "Auth0 error",
        message: error.message,
        body: error.response.body,
      });
    }

    res.status(500).json({
      error: "Failed to fetch user profile",
      message: error.message,
    });
  }
});

// PATCH /api/users/:userId - Update user profile
router.patch("/:userId", verifyToken, async (req, res) => {
  try {
    const userId = decodeUserId(req.params.userId);
    const { name, picture, user_metadata } = req.body;

    // Only allow the same user to update their profile
    // if (req.user.sub !== userId) {
      // return res.status(403).json({ error: "Forbidden" });
    // }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (picture !== undefined) updateData.picture = picture;
    if (user_metadata !== undefined) updateData.user_metadata = user_metadata;

    const updatedUser = await management.users.update( userId , updateData);

    res.json({
      message: "User profile updated successfully",
      user: {
        user_id: updatedUser.user_id,
        email: updatedUser.email,
        name: updatedUser.name,
        nickname: updatedUser.nickname,
        picture: updatedUser.picture,
        user_metadata: updatedUser.user_metadata || {},
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: "Failed to update user profile",
      message: error.message,
    });
  }
});

// PATCH /api/users/:userId/metadata - Update user metadata only
router.patch("/:userId/metadata", verifyToken, async (req, res) => {
  try {
    const userId = decodeUserId(req.params.userId);
    const { user_metadata } = req.body;

    if (req.user.sub !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (!user_metadata) {
      return res.status(400).json({ error: "user_metadata is required" });
    }

    const updatedUser = await management.users.update({ id: userId }, { user_metadata });

    res.json({
      message: "User metadata updated successfully",
      user_metadata: updatedUser.user_metadata || {},
    });
  } catch (error) {
    console.error("Error updating user metadata:", error);
    res.status(500).json({
      error: "Failed to update user metadata",
      message: error.message,
    });
  }
});

export default router;
