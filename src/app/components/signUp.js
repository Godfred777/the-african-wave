"use client";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";

export default function SignUp() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length === 0) {
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User signed up:", user);
          router.push("/rssfeeds");
        })
        .catch((error) => {
          console.error("Error signing up:", error.code, error.message);
          setErrors({
            ...errors,
            signUp: "Failed to sign up. Please try again.",
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
                src="/logo.png" // Replace with your actual logo path
                alt="The African Wave Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Create Account
          </h2>
          <p className="text-green-700">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-green-800"
              >
                Username
              </label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-green-800"
              >
                Confirm Password
              </label>
              <input
                className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {errors.signUp && (
            <div className="text-center bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-600">{errors.signUp}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            Sign Up
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-green-700">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-green-800 hover:text-green-900 font-medium underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
