import { Router } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;
    onAuthStateChanged(auth, (user) => {
        setIsLoggedIn(!!user);
    });
    // Function to toggle the mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Function to scroll to the top of the page smoothly
    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        if (isMenuOpen) toggleMenu(); // Close menu on mobile after click
    };

    // Function to scroll to the "About" section smoothly
    const handleScrollToAbout = () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ top:0, behavior: 'smooth' });
        }
        if (isMenuOpen) toggleMenu(); // Close menu on mobile after click
    };

    return (
        <>
            <header className="header bg-gray-900 text-gray-200 backdrop-blur-lg flex justify-between items-center px-4 sm:px-10 py-2 shadow-gray-400 shadow-sm sticky top-0 z-50">
                
                <div className="header-title text-xl sm:text-2xl font-medium font-serif flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={handleScrollToTop}>
                    <div className="header-logo font-serif text-orange-600 bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xl sm:text-3xl font-bold hover:rotate-180 duration-300 transition-all">
                        N
                    </div>
                    <RouterLink to="/" onClick={handleScrollToTop} className="header-text hover:scale-110 duration-300 transition-all">
                        NoteNexus
                    </RouterLink>
                </div>

                <div className="header-links hidden md:flex gap-10 font-serif text-md">
                    <RouterLink to="/" onClick={handleScrollToTop} className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">
                        Home
                    </RouterLink>
                    <RouterLink to="/about" onClick={handleScrollToTop} className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">
                        About
                    </RouterLink>
                    <RouterLink to="/resource" onClick={handleScrollToTop} className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">
                        Resources
                    </RouterLink>
                    <RouterLink to="/pyq" onClick={handleScrollToTop} className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">
                        PYQ's
                    </RouterLink>
                    {isLoggedIn && 
                        <RouterLink to="/upload" onClick={handleScrollToTop} className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">
                            Upload
                        </RouterLink>
                    }
                </div>

                <div className="header-login-section flex items-center gap-5 font-serif text-md">
                    {isLoggedIn ? 
                        <button className="border-1 border-gray-200 hover:scale-110 hover:border-orange-500 bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center duration-300 transition-all text-xl sm:text-2xl" >
                            <RouterLink to="/profile">
                                <img src={user.photoURL} alt="" className="rounded-full"/>
                            </RouterLink>
                        </button>
                    :
                        <div className="hidden md:block">
                           <button className="header-login hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">
                                <RouterLink to="/login">
                                    Login / SignUp
                                </RouterLink>
                           </button>
                        </div>
                    }
                    <div className="md:hidden relative">
                        <button onClick={toggleMenu} className="focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>

                        {/* Dropdown menu for mobile */}
                        {isMenuOpen && (
                            <div className="absolute top-10 right-0 w-48 bg-gray-700 text-gray-200 shadow-lg rounded-md transform transition-all duration-300 ease-in-out">
                                <div className="flex flex-col py-2">
                                    <button onClick={handleScrollToTop} className="text-left hover:bg-gray-600 px-4 py-2 transition-colors duration-200">
                                        <RouterLink to="/">Home</RouterLink>
                                    </button>
                                    <button onClick={handleScrollToTop} className="text-left hover:bg-gray-600 px-4 py-2 transition-colors duration-200">
                                        <RouterLink to="/about">About</RouterLink>
                                    </button>
                                    <button onClick={handleScrollToTop} className="text-left hover:bg-gray-600 px-4 py-2 transition-colors duration-200">
                                        <RouterLink to="/resource">Resources</RouterLink>
                                    </button>
                                    <button onClick={handleScrollToTop} className="text-left hover:bg-gray-600 px-4 py-2 transition-colors duration-200">
                                        <RouterLink to="/pyq">PYQ's</RouterLink>
                                    </button>
                                    {isLoggedIn && 
                                        <button onClick={handleScrollToTop} className="text-left hover:bg-gray-600 px-4 py-2 transition-colors duration-200">
                                            <RouterLink to="/upload">Upload</RouterLink>
                                        </button>
                                    }
                                    <hr className="border-t border-gray-600 my-2" />

                                    {isLoggedIn ?
                                        <button className="text-left hover:bg-gray-600 px-4 py-2 transition-colors duration-200">
                                            <RouterLink to="/profile">Profile</RouterLink>
                                        </button> 
                                    
                                    : (
                                        <button className="text-left hover:bg-gray-600 px-4 py-2 transition-colors duration-200">
                                            <RouterLink to="/login">
                                                Login / SignUp
                                            </RouterLink>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;

