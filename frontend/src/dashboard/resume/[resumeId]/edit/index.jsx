import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from './../../../../../service/GlobalApi';
import { Loader2 } from 'lucide-react'; // Import a loading icon
import { toast } from 'sonner'; // Assuming you use sonner for notifications

function EditResume() {
    const { resumeId } = useParams();
    const [resumeInfo, setResumeInfo] = useState();
    const [loading, setLoading] = useState(true); // New loading state

    useEffect(() => {
        GetResumeInfo();
    }, []);

    const GetResumeInfo = () => {
        setLoading(true);
        GlobalApi.GetResumeByResumeId(resumeId)
            .then(resp => {
                const dataArray = resp.data.data;

                if (Array.isArray(dataArray)) {
                    // Find the matching resume object
                    const fetchedResume = dataArray.find(resume => resume.attributes.resumeId === resumeId);
                    
                    if (fetchedResume) {
                        // Extract the attributes (the actual data payload)
                        setResumeInfo(fetchedResume.attributes);
                        toast.success("Resume data loaded successfully.");
                    } else {
                        toast.error("Error: Resume not found.");
                    }
                } else {
                    toast.error("Error: Received invalid data format.");
                }
            })
            .catch(error => {
                console.error("Error fetching resume info:", error);
                toast.error("Failed to load resume data.");
            })
            .finally(() => {
                setLoading(false); // Stop loading regardless of success/fail
            });
    };

    // --- Loading and Error States ---
    if (loading) {
        return (
            <div className='min-h-screen bg-slate-950 flex items-center justify-center'>
                <Loader2 className='h-12 w-12 text-cyan-400 animate-spin' />
                <p className='ml-4 text-xl text-slate-400'>Loading your workspace...</p>
            </div>
        );
    }
    
    // You might want to add a state check here for a permanent error/not found screen
    if (!resumeInfo && !loading) {
         return (
            <div className='min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center'>
                <p className='text-3xl text-red-400'>Resume Not Found.</p>
                <p className='text-slate-400 mt-2'>Please check the link or return to your dashboard.</p>
            </div>
        );
    }

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div className='min-h-screen bg-slate-950 p-4 md:p-8 lg:p-10'>
                <h1 className='text-4xl font-extrabold text-white mb-6 mt-10'>
                    Editing: <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500'>
                        {resumeInfo?.title || 'Untitled Resume'}
                    </span>
                </h1>
                
                <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
                    
                    {/* --- 📝 Form Section (3/5 width on large screens) --- */}
                    <div className='lg:col-span-3 bg-neutral-100 p-6 rounded-xl shadow-2xl border border-neutral-300'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-3'>
                            Resume Builder Form
                        </h2>

                        <FormSection />
                    </div>
                        
    

                    {/* --- 👁️ Preview Section (2/5 width on large screens) --- */}
                    <div className='lg:col-span-2 relative'>
                        {/* Sticky Preview for better interaction */}
                        <div className='lg:sticky lg:top-4 bg-neutral-100 p-4 rounded-xl shadow-2xl border border-neutral-300'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-3'>
                                Live Preview
                            </h2>
                            {/* The ResumePreview component should display the resume document on a white/light canvas */}
                            <div className='bg-white shadow-xl rounded-lg overflow-hidden min-h-[500px]'>
                                <ResumePreview />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default EditResume;