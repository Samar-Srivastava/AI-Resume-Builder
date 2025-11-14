import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import GlobalApi from './../../service/GlobalApi'
import { useUser } from '@clerk/clerk-react'
import ResumeCardItem from './components/ResumeCardItem';
import { motion } from 'framer-motion'; // For smooth, exciting animations

function Dashboard() {
    
    const {user, isLoaded}=useUser();
    const [resumeList,setResumeList]=useState([]);

    // Fetch resume list only after user object is fully loaded
    useEffect(()=>{
      if(user && user.primaryEmailAddress?.emailAddress) {
        GetResumesList();
      }
    }, [user, isLoaded]) // Depend on both user and isLoaded

    const GetResumesList=()=>{
        // Using a safe access pattern for the email
        const email = user?.primaryEmailAddress?.emailAddress;

        if (email) {
             GlobalApi.GetUserResumes(email)
            .then(resp=>{
                console.log(resp.data.data);
                // Ensure data is an array before setting state
                if (Array.isArray(resp.data.data)) {
                    setResumeList(resp.data.data);
                }
            })
            .catch(error => {
                console.error("Error fetching resumes:", error);
                // Optionally handle error state
            });
        }
    }

    // Animation settings for the grid items
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Stagger animation for each card
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };


    return (
        // The main container inherits the dark theme
        <div className='min-h-screen bg-slate-950 text-gray-200 p-8 md:px-16 lg:px-24'>
            
            {/* --- Hero Welcome Section --- */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className='py-10 border-b border-slate-800 mb-10'
            >
                {/* Welcome Message with User's First Name */}
                <h2 className='text-4xl md:text-5xl font-extrabold text-white mt-10'>
                    Welcome back, <span className='bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500'>
                        {user?.firstName || 'User'}
                    </span>!
                </h2>
                
                {/* Dashboard Subtitle */}
                <p className='mt-5 text-xl text-slate-400'>
                    Ready to refine your profile? Your powerful resumes are waiting.
                </p>
            </motion.div>

            {/* --- Resume List / Grid Section --- */}
            <h3 className='font-bold text-2xl text-white mb-6'>
                My Resumes ({resumeList.length})
            </h3>

            <motion.div 
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 1. The Add Resume Card (Static first item) */}
                <motion.div variants={itemVariants}>
                    <AddResume />
                </motion.div>

                {/* 2. List of Existing Resumes */}
                {resumeList.length > 0 && resumeList.map((resume, index) => (
                    <motion.div 
                        key={index}
                        variants={itemVariants}
                        // ResumeCardItem must be styled to fit the dark theme.
                        // It should use a dark background (e.g., bg-slate-800) and white text.
                    >
                        <ResumeCardItem 
                            resume={resume} 
                            refreshData={GetResumesList}
                        />
                    </motion.div>
                ))}
                
                {/* --- Empty State --- */}
                {resumeList.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="col-span-full py-12 text-center"
                    >
                        <svg className="w-16 h-16 mx-auto text-cyan-500 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="mt-4 text-xl text-slate-400">
                            Looks like you haven't created a resume yet.
                        </p>
                        <p className="text-slate-500">
                            Click the 'Add New Resume' card to begin!
                        </p>
                    </motion.div>
                )}

            </motion.div>

        </div>
    )
}

export default Dashboard