import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
});

// @desc    Sign in (or sign up) with a Google ID token from the frontend
// @route   POST /api/auth/google
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: "Missing Google credential" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res
        .status(500)
        .json({ success: false, message: "Server is missing GOOGLE_CLIENT_ID" });
    }

    // This call verifies the token's signature, audience, issuer and
    // expiry against Google's public keys — it is the step that proves
    // the credential really came from Google and wasn't forged.
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email_verified) {
      return res
        .status(401)
        .json({ success: false, message: "Google account could not be verified" });
    }

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      // also cover the case where the email already exists from a
      // different sign-in path, to avoid a duplicate-key error
      user = await User.findOne({ email: payload.email });
    }

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
        avatar: payload.picture || "",
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      user.avatar = payload.picture || user.avatar;
      await user.save();
    }

    const token = signToken(user._id);

    res.status(200).json({ success: true, token, user: toPublicUser(user) });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(401).json({ success: false, message: "Google sign-in failed" });
  }
};

// @desc    Get the currently authenticated user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
