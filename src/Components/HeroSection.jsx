import React from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function HeroSection() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth();
        const user = auth.currentUser;
        onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
        // Function to toggle the mobile menu
        const toggleMenu = () => {
            setIsMenuOpen(!isMenuOpen);
        };

    return (
        <>
            <div id='hero-section' className=" max-w-full min-h-screen bg-gray-900 text-gray-200 flex flex-col md:flex-row">
                
                {/* Left Side: Text Content */}
                <div className="hero-section-text flex flex-col w-full md:w-1/2 min-h-[50vh] ">
                    <div className="flex flex-row px-4 sm:px-8 pt-8 items-center justify-center md:justify-start">
                        <div className="text-[6rem] sm:text-[12rem] md:text-[18rem] text-orange-500 hover:rotate-15 transition-transform duration-500 font-serif font-bold">
                            N
                        </div>
                        <div className="text-4xl sm:text-5xl md:text-[6rem] tracking-widest flex flex-col mt-6 sm:mt-10 font-serif font-bold">
                            <div className="hover:scale-115 transition-transform duration-300">OTE</div>
                            <div className="hover:scale-115 transition-transform duration-300">EXUS</div>
                        </div>
                    </div>
                    <div className="px-8 sm:px-20 text-center md:text-left">
                        <div className="bg-gray-800 p-6 rounded-3xl shadow-md shadow-orange-500/50 hover:scale-105 transition-transform duration-300">
                            <p className="text-lg sm:text-xl font-extralight font-mono text-gray-400 hover:scale-105 duration-300 transition-all hover:text-orange-500">
                                KYU NHI HO RHI PADHAI ?
                            </p>
                            <p className="text-lg sm:text-xl font-extralight font-mono mt-4 text-gray-400 hover:scale-105 duration-300 transition-all hover:text-orange-500">
                                NO WORRIES, WE GOT YOU COVERED.
                            </p>
                        </div>
                        <div className="mt-12 gap-6 flex flex-col sm:flex-row justify-center md:justify-start">

                            {isLoggedIn ? (
                                <button className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition duration-300 transform hover:scale-105 shadow-lg">
                                    <RouterLink to="/resource">Get Started</RouterLink>
                                </button>
                            )
                                :
                            (
                            <button className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition duration-300 transform hover:scale-105 shadow-lg">
                                <RouterLink to="/login">Login / SignUp</RouterLink>
                            </button>
                            )}

                        </div>
                    </div>
                </div>

                {/* Right Side: Visual Elements */}
                <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen flex items-center justify-center p-4 md:p-10 relative overflow-hidden bg-gray-900">
                    {/* Responsive container for the orbiting elements */}
                    <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] flex items-center justify-center">
                        
                        {/* ✅ Orbiting Container: Animation is now enabled on all screen sizes */}
                        <div className="w-full h-full animate-spin-slower relative">

                            {/* Feature 1: PYQs */}
                            <div className="card-container absolute top-1/2 left-0 -translate-y-1/2">
                                {/* ✅ Reverse animation enabled on all screen sizes */}
                                <div className="feature-card flex flex-col items-center animate-spin-slower-reverse rounded-2xl md:rounded-4xl bg-gray-800 p-2 md:p-4 shadow-md shadow-orange-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-25 md:w-25 text-orange-400" fill="none" viewBox="0 0 24 26" stroke="currentColor" strokeWidth={0.5}>
                                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="card-tooltip text-base md:text-xl">PYQs</span>
                                </div>
                            </div>
                            
                            {/* Feature 2: AI Solutions */}
                            <div className="card-container absolute top-0 left-1/2 -translate-x-1/2">
                                <div className="feature-card flex flex-col items-center animate-spin-slower-reverse rounded-2xl md:rounded-4xl bg-gray-800 p-2 md:p-4 shadow-md shadow-teal-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-25 md:w-25 text-teal-400" fill="none" viewBox="0 0 16 22" stroke="currentColor" strokeWidth={0.5}>
                                        <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z"/>
                                    </svg>
                                    <span className="card-tooltip text-base md:text-xl">AI Solutions</span>
                                </div>
                            </div>

                            {/* Feature 3: NOTES */}
                            <div className="card-container absolute top-1/2 right-0 -translate-y-1/2">
                                <div className="feature-card flex flex-col items-center animate-spin-slower-reverse rounded-2xl md:rounded-4xl bg-gray-800 p-2 md:p-4 shadow-md shadow-indigo-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-20 md:w-20 my-[0.35rem] md:m-3 text-indigo-400" fill="none" viewBox="0 0 16 18" stroke="currentColor" strokeWidth={0.5}>
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                    <span className="card-tooltip text-base md:text-xl">Notes</span>
                                </div>
                            </div>

                            {/* Feature 4: LAB */}
                            <div className="card-container absolute bottom-0 left-1/2 -translate-x-1/2">
                                <div className="feature-card flex flex-col items-center animate-spin-slower-reverse rounded-2xl md:rounded-4xl bg-gray-800 p-2 md:p-4 shadow-md shadow-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-25 md:w-25 text-green-400" fill="none" viewBox="0 0 16 22" stroke="currentColor" strokeWidth={0.5}>
                                        <path d="M4.5 0a.5.5 0 0 0 0 1H5v5.36L.503 13.717A1.5 1.5 0 0 0 1.783 16h12.434a1.5 1.5 0 0 0 1.28-2.282L11 6.359V1h.5a.5.5 0 0 0 0-1zM10 2H9a.5.5 0 0 0 0 1h1v1H9a.5.5 0 0 0 0 1h1v1H9a.5.5 0 0 0 0 1h1.22l.61 1H10a.5.5 0 1 0 0 1h1.442l.611 1H11a.5.5 0 1 0 0 1h1.664l.611 1H12a.5.5 0 1 0 0 1h1.886l.758 1.24a.5.5 0 0 1-.427.76H1.783a.5.5 0 0 1-.427-.76l4.57-7.48A.5.5 0 0 0 6 6.5V1h4z"/>   
                                    </svg>
                                    <span className="card-tooltip text-base md:text-xl">Lab</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeroSection;