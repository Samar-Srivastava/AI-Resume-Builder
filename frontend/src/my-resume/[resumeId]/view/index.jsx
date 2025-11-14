import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../service/GlobalApi';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import Header from '@/components/Custom/Header';
import { Button } from '@/components/ui/button';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import { RWebShare } from 'react-web-share';
import { Download, Share2 } from 'lucide-react'; // Import icons
import { toast } from 'sonner';

function ViewResume() {
    const [resumeInfo, setResumeInfo] = useState(null); // Initialize as null
    const { resumeId } = useParams();

    // --- Data Fetching Logic (Cleaned up) ---
    useEffect(() => {
        GetResumeInfo();
    }, [resumeId]);

    const GetResumeInfo = () => {
        GlobalApi.GetResumeByResumeId(resumeId)
            .then(resp => {
                const dataArray = resp.data.data;

                if (Array.isArray(dataArray)) {
                    const fetchedResume = dataArray.find(resume => resume.attributes.resumeId === resumeId);
                    
                    if (fetchedResume) {
                        setResumeInfo(fetchedResume.attributes);
                        toast.success("Resume ready for viewing!");
                    } else {
                        toast.error("Resume not found or access denied.");
                    }
                } else {
                    toast.error("Error: Invalid data format.");
                }
            })
            .catch(error => {
                console.error("Error fetching resume info:", error);
                toast.error("Failed to load resume data.");
            });
    };

    // --- Handlers ---
    const HandleDownload = () => {
        // Triggers the browser's print dialog, which offers "Save as PDF"
        window.print();
    };
    const handleShareClick = () => {
      const shareData = {
          text: `Check out my professional resume created with AI. It's ready for your review!`,
          url: `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`,
          title: resumeTitle,
      };
      
      // Log the data being sent to help debug the URL structure
      console.log("Attempting to share with data:", shareData);
  
      // This toast confirms the user clicked the button and the RWebShare component was engaged
      toast.info("Attempting to open share dialogue...", { duration: 1500 });
  };

    const resumeTitle = resumeInfo?.firstName && resumeInfo?.lastName 
        ? `${resumeInfo.firstName} ${resumeInfo.lastName}'s Resume` 
        : "AI Generated Resume";

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div className='min-h-screen bg-slate-950 text-gray-200'>
                {/* --- Control Header (Hidden from Print) --- */}
                <div id="no-print" className='w-full'>
                    <Header />

                    <div className='container mx-auto text-center py-16 px-4'>
                        <h2 className='text-4xl font-extrabold mt-10'>
                            <span className='bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-600'>
                                Congrats! Your Ultimate Resume is Ready!
                            </span>
                        </h2>
                        <p className='mt-4 text-lg text-slate-400 max-w-2xl mx-auto'>
                            Your AI-optimized profile is complete. Now you can download or share the unique link with recruiters and network.
                        </p>

                        {/* --- Action Buttons --- */}
                        <div className='flex justify-center gap-6 mt-10'>
                            
                            {/* Download Button */}
                            <Button 
                                onClick={HandleDownload}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-md rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                            >
                                <Download className='h-5 w-5 mr-2' /> Download PDF
                            </Button>
                            
                            {/* Share Button (Gradient/Interactive) */}
                            <RWebShare
                                data={{
                                    text: `Check out my professional resume created with AI. It's ready for your review!`,
                                    url: `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`,
                                    title: resumeTitle,
                                }}
                                onClick={handleShareClick}
                            >
                                <Button
                                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white font-bold text-md rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                                >
                                    <Share2 className='h-5 w-5 mr-2' /> Share Link
                                </Button>
                            </RWebShare>
                        </div>
                    </div>
                </div>

                {/* --- Resume Preview Area --- */}
                <div className='mb-1 container mx-auto px-4'>
                    {/* The resume itself must be on a white background for printing */}
                    <div id='print-area' className='shadow-2xl mx-auto max-w-4xl bg-white rounded-lg overflow-hidden'>
                        <ResumePreview />
                    </div>
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default ViewResume;