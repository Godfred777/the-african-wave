"use client";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/rssfeeds");
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length === 0) {
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User signed in:", user);
          router.push("/rssfeeds");
        })
        .catch((error) => {
          console.error("Error signing in:", error.code, error.message);
          setErrors({
            ...errors,
            signIn: "Failed to sign in. Please check your credentials.",
          });
        });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-white to-stone-100">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-md border border-stone-200">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.png"
                alt="The African Wave Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-green-700">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-green-800"
              >
                Email
              </label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-green-800"
              >
                Password
              </label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {errors.signIn && (
            <div className="text-center bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-600">{errors.signIn}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            Sign In
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-green-700">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-green-800 hover:text-green-900 font-medium underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
