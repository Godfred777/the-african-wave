"use client";
import { useState } from "react";
import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length === 0) {
            // Submit the form
            console.log('Form submitted:', formData);
            // Add your API call here
            createUserWithEmailAndPassword(auth, formData.email, formData.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log('User signed up:', user);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error('Error signing up:', errorCode, errorMessage);
                    setErrors({ ...errors, signUp: 'Failed to sign up. Please try again.' });
                });
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
            <h2
                className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white-900"
            >
                Sign Up for an Account
            </h2>
            <h2 className="mt-10 text-center text-2xl">Welcome! Please fill in the details below:</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username">Username:</label>
                    <input className="inline-block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <span className="text-red-500 text-xs italic mt-1.5 block">{errors.username}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="email">Email:</label>
                    <input className="inline-block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className="text-red-500 text-xs italic mt-1.5 block">{errors.email}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password">Password:</label>
                    <input className="inline-block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className="text-red-500 text-xs italic mt-1.5 block">{errors.password}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input className="inline-block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <span className="text-red-500 text-xs italic mt-1.5 block">{errors.confirmPassword}</span>}
                </div>

                <button className="mt-2.5 flex w-full justify-center rounded-md bg-black bg-opacity-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-500 hover:text-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign Up
                </button>
            </form>
        </div>
    );
}