"use client";
import { useState } from "react";

export default function SignIn() {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        // Submit the form
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length === 0) {
            // Submit the form
            console.log('Form submitted:', formData); // Uncommented for debugging
            // Add your API call here
        } else {
            setErrors(newErrors);
        }
        
    };

    return (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
            <h2
                className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white-900"
            >
                Sign In to Your Account
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email">Email:</label>
                    <input className="inline-block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo" 
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password">Password:</label>
                    <input className="inline-block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo"
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                    />
                </div>
                <button className="mt-2.5 flex w-full justify-center rounded-md bg-black bg-opacity-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-500 hover:text-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Sign In
                </button>
            </form>
        </div>
    );
}