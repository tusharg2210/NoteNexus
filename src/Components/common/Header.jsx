import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Correct path to your context

function Header() {
    const { user } = useAuth(); // Get user from the context
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (isMenuOpen) {
            toggleMenu(); // Close menu on mobile after click
        }
    };

    return (
        <header className="header bg-gray-900 text-gray-200 backdrop-blur-lg flex justify-between items-center px-4 sm:px-10 py-2 shadow-gray-400 shadow-sm sticky top-0 z-50">
            
            <RouterLink to="/" onClick={handleLinkClick} className="header-title text-xl sm:text-2xl font-medium font-serif flex items-center gap-2 sm:gap-3 cursor-pointer">
                <div className="header-logo font-serif text-orange-600 bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xl sm:text-3xl font-bold hover:rotate-180 duration-300 transition-all">
                    N
                </div>
                <span className="header-text hover:scale-110 duration-300 transition-all">
                    NoteNexus
                </span>
            </RouterLink>

            {/* Desktop Menu */}
            <nav className="header-links hidden md:flex gap-10 font-serif text-md">
                <RouterLink to="/" onClick={handleLinkClick} className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">Home</RouterLink>
                <RouterLink to="/about" onClick={handleLinkClick} className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">About</RouterLink>
                <RouterLink to="/resource" onClick={handleLinkClick} className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">Resources</RouterLink>
                <RouterLink to="/pyq" onClick={handleLinkClick} className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">PYQ's</RouterLink>
                {user && <RouterLink to="/upload" onClick={handleLinkClick} className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">Upload</RouterLink>}
            </nav>

            {/* Login/Profile and Mobile Menu Button */}
            <div className="header-login-section flex items-center gap-5 font-serif text-md">
                {user ? (
                    <RouterLink to="/profile" className="border-1 border-gray-200 hover:scale-110 hover:border-orange-500 bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center duration-300 transition-all">
                        {user.photoURL ? <img src={user.photoURL} alt="Profile" className="rounded-full w-full h-full object-cover"/> : <span>{user.displayName?.charAt(0)}</span>}
                    </RouterLink>
                ) : (
                    <div className="hidden md:block">
                        <RouterLink to="/login" className="hover:scale-110 hover:bg-gray-100 hover:text-black p-1.5 px-3 rounded-full duration-300 transition-all">Login / SignUp</RouterLink>
                    </div>
                )}
                
                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-700 text-gray-200 shadow-lg rounded-md md:hidden">
                    <div className="flex flex-col py-2">
                        <RouterLink to="/" onClick={handleLinkClick} className="text-left hover:bg-gray-600 px-4 py-2">Home</RouterLink>
                        <RouterLink to="/about" onClick={handleLinkClick} className="text-left hover:bg-gray-600 px-4 py-2">About</RouterLink>
                        <RouterLink to="/resource" onClick={handleLinkClick} className="text-left hover:bg-gray-600 px-4 py-2">Resources</RouterLink>
                        <RouterLink to="/pyq" onClick={handleLinkClick} className="text-left hover:bg-gray-600 px-4 py-2">PYQ's</RouterLink>
                        {user && <RouterLink to="/upload" onClick={handleLinkClick} className="text-left hover:bg-gray-600 px-4 py-2">Upload</RouterLink>}
                        <hr className="border-t border-gray-600 my-2" />
                        {user ? (
                            <RouterLink to="/profile" onClick={handleLinkClick} className="text-left hover:bg-gray-600 px-4 py-2">Profile</RouterLink> 
                        ) : (
                            <RouterLink to="/login" onClick={handleLinkClick} className="text-left hover:bg-gray-600 px-4 py-2">Login / SignUp</RouterLink>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;