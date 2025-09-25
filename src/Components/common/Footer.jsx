import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

function Footer(){
    // Social links data
    const socialLinks = [
        { name: 'GitHub', color: 'text-gray-400', href: 'https://github.com/tusharg2210/NoteNexus', icon:
        <svg className="w-6 h-6 hover:fill-orange-500" fill='currentColor' viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path></svg> },
        ];
    const currentYear = new Date().getFullYear();
    const quickLinks = [
        { name: 'Home', to: '/' },
        { name: 'Team', to: '/team' },
        { name: 'Features', to: '/features' },
        { name: 'About Us', to: '/about' },
    ];
    const resources = [
        { name: 'PYQs', to: '/pyq' },
        { name: 'Notes', to: '/resource' },
        { name: 'Lab', to: '/resource' },
    ];
    const legalLinks = [
        { name: 'Privacy Policy', to: '/privacy-policy' },
        { name: 'Terms of Service', to: '/terms-of-service' },
    ];
    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <h2 className="text-2xl font-bold text-orange-500 font-serif tracking-widest">NoteNexus</h2>
                        <p className="text-gray-400 mt-2">Your central hub for academic success.</p>
                        <div className="flex space-x-4 mt-4">
                            {socialLinks.map((link) => (
                                <a key={link.name} href={link.href} className={`${link.color} hover:scale-115 transition-colors duration-300`} aria-label={link.name}>
                                    <span className="sr-only">{link.name}</span>
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold tracking-wide">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <RouterLink to={link.to} onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-orange-400 hover:underline transition-all duration-300">
                                        {link.name}
                                    </RouterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold tracking-wide">Resources</h3>
                        <ul className="mt-4 space-y-2">
                            {resources.map((link) => (
                                <li key={link.name}>
                                    <RouterLink to={link.to} onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-orange-400 hover:underline transition-all duration-300">
                                        {link.name}
                                    </RouterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold tracking-wide">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <RouterLink to={link.to} onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-orange-400 hover:underline transition-all duration-300">
                                        {link.name}
                                    </RouterLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        &copy; {currentYear} NoteNexus. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
