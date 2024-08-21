import { signInFailure, signInSuccess } from "@/redux/user/userSlice";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase";
import { useToast } from "../ui/use-toast";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Googel Sign in Failed");
      }

      toast({ description: "Sign In Successfull!" });
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      className="flex items-center justify-center gap-2 w-full mt-6 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      <FcGoogle size={25} />
      Continue with Google
    </button>
  );
};

export default OAuth;
