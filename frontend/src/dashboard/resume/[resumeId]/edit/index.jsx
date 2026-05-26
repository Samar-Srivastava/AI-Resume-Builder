import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import AtsPanel from '../../components/AtsPanel';
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
                const record = resp.data?.data;
                const attrs = record?.attributes;

                if (attrs) {
                    setResumeInfo({
                        ...attrs,
                        templateId: attrs.templateId || 'classic',
                    });
                    toast.success("Resume data loaded successfully.");
                } else {
                    toast.error("Error: Resume not found.");
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
            <div className='min-h-screen bg-slate-950 p-4 md:p-8 lg:p-10 pt-24'>
                <h1 className='text-3xl md:text-4xl font-extrabold text-white mb-6'>
                    Editing: <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500'>
                        {resumeInfo?.title || 'Untitled Resume'}
                    </span>
                </h1>
                
                <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
                    
                    {/* --- 📝 Form Section (3/5 width on large screens) --- */}
                    <div className='lg:col-span-3 bg-slate-900/80 p-6 rounded-xl shadow-2xl border border-slate-700'>
                        <FormSection />
                    </div>

                    <div className='lg:col-span-2 relative'>
                        <div className='lg:sticky lg:top-24 bg-slate-900/80 p-4 rounded-xl shadow-2xl border border-slate-700'>
                            <h2 className='text-lg font-bold text-white mb-4 pb-2 border-b border-slate-700'>
                                Live Preview
                            </h2>
                            {/* The ResumePreview component should display the resume document on a white/light canvas */}
                            <div className='bg-white shadow-xl rounded-lg overflow-hidden min-h-[500px]'>
                                <ResumePreview />
                            </div>
                            <AtsPanel />
                        </div>
                    </div>
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default EditResume;