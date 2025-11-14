import React from 'react'
import { Button } from '../ui/button' // Assuming these are standard shadcn/ui buttons or similar
import { Link } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'
import cv from "../../assets/cv.png"

function Header() {
    const{user,isSignedIn}=useUser();
    
    // Custom button styles to match the new dark theme gradients
    const GradientButton = ({ children, to }) => (
        <Link to={to}>
            <Button
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
            >
                {children}
            </Button>
        </Link>
    );

    return (
        // Added 'fixed top-0 w-full z-50' for a consistent, sticky header
        <div className='p-3 px-5 flex justify-between items-center bg-slate-900 border-b border-slate-800 fixed top-0 w-full z-50'>
            
            {/* Logo/Brand Name */}
            <Link 
                to="/" 
                className="text-2xl font-extrabold text-white flex items-center gap-2 transition-colors hover:text-cyan-400"
            >
                {/* Text */}
                AI.Resume
                
                {/* Image - Controlled Size */}
                <img 
                    src={cv} 
                    alt="AI Resume Logo Icon" 
                    className='h-8 w-8' // Use a smaller size (h-8 w-8) for better header alignment
                />
            </Link>
            {isSignedIn ? (
                // Signed In View: Shows Home, Dashboard, and User Profile
                <div className='flex gap-4 items-center'>
                    {/* Home Link (Subtle style) */}
                    <Link to={'/'}>
                        <Button 
                            variant="outline" 
                            className="bg-slate-800 text-cyan-400 border-cyan-400 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                            Home
                        </Button>
                    </Link>
                    
                    {/* Dashboard Link (Primary internal button) */}
                    <Link to={'/dashboard'}>
                        <Button 
                            variant="outline" 
                            className="bg-slate-800 text-cyan-400 border-cyan-400 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                            Dashboard
                        </Button>
                    </Link>
                    
                    {/* Clerk UserButton */}
                    <UserButton afterSignOutUrl='/' />
                </div>
            ) : (
                // Signed Out View: Shows only Get Started button
                <GradientButton to={'/auth/sign-in'}>
                    Get Started
                </GradientButton>
            )}
        </div>
    );
}

export default Header