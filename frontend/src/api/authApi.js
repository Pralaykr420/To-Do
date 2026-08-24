import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not configured");
}
// Sends the Google ID token to our backend, which verifies it with Google
// and returns our own app JWT + the user record.
export const googleSignIn = (credential) =>
  axios
    .post(`${API_URL}/auth/google`, { credential })
    .then((res) => res.data)
    .catch((err) => {
      const message = err.response?.data?.message || err.message || "Sign-in failed";
      throw new Error(message);
    });
