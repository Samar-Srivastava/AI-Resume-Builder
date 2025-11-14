import { Loader2Icon, MoreVertical, Notebook } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import cv from "../../assets/cv.png"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import GlobalApi from './../../../service/GlobalApi';
import { toast } from 'sonner';

function ResumeCardItem({ resume, refreshData }) {
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    
    // Fallback theme color for the dynamic styling
    const themeColor = resume.attributes.themeColor || '#6366f1'; // Indigo-500 fallback

    // --- Delete Function ---
    const onDelete = () => {
        // Use the documentId from the structure if available, or the resumeId attribute
        const resumeId = resume.attributes.resumeId; 
        
        if (!resumeId) {
            toast.error("Resume ID is missing. Cannot delete the resume.");
            return;
        }

        setLoading(true);
        GlobalApi.DeleteResumeByResumeId(resumeId)
            .then(resp => {
                console.log(resp);
                toast.success("Resume Deleted successfully!");
                refreshData();
                setLoading(false);
                setOpenAlert(false);
            })
            .catch(error => {
                console.error("Error deleting resume:", error.message);
                toast.error("Failed to delete the resume.");
                setLoading(false);
            });
    };

    return (
        <div className='group relative w-full'>

            {/* --- Resume Card Body (Link/Click Area) --- */}
            <Link to={'/dashboard/resume/' + resume.attributes.resumeId + "/edit"}>
                <div
                    className='p-14 
                    flex flex-col items-center justify-center h-[280px]
                    bg-slate-800 rounded-t-xl
                    border-t-4 border-b-2 border-slate-700
                    hover:scale-[1.03] 
                    transition-all duration-300
                    cursor-pointer relative overflow-hidden'
                    
                    style={{
                        // Use theme color for the border accent
                        borderTopColor: themeColor,
                        // Custom shadow effect for exciting interaction
                        boxShadow: `0 8px 15px -3px ${themeColor}55`,
                    }}
                >
                    {/* Visual Placeholder */}
                    <img 
                        src={cv} 
                        alt="Resume Icon" 
                        className='w-16 h-16 mb-3 text-gray-400 group-hover:text-white transition-colors' 
                    />

                    <h3 className='text-md font-medium text-slate-400 mt-4 group-hover:text-white transition-colors'>
                        {resume.attributes.title}
                    </h3>
                    {/* Subtle Gradient Glow on Hover */}
                    <div 
                        className='absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300'
                        style={{
                            background: `linear-gradient(to bottom right, ${themeColor}AA, transparent 80%)`,
                        }}
                    />
                </div>
            </Link>

            {/* --- Action Bar (Footer) --- */}
            <div 
                className='p-3 flex justify-between items-center rounded-b-xl shadow-lg border-b-4 border-l-2 border-r-2 border-slate-700'
                style={{
                    backgroundColor: themeColor, // Use theme color for the background
                }}
            >
                <h2 className='text-sm font-semibold text-white truncate max-w-[70%]'>
                    {resume.attributes.title}
                </h2>
                
                {/* --- Dropdown Menu for Actions --- */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        {/* MoreVertical Icon (styled white for visibility) */}
                        <MoreVertical className='h-5 w-5 cursor-pointer text-white hover:text-gray-200' />
                    </DropdownMenuTrigger>

                    {/* Dropdown Content (Styled for dark theme via custom classes) */}
                    <DropdownMenuContent className="bg-slate-800 border-slate-700 text-gray-200">
                        {/* Edit Action */}
                        <DropdownMenuItem 
                            onClick={() => navigation('/dashboard/resume/' + resume.attributes.resumeId + "/edit")}
                            className="hover:bg-slate-700 cursor-pointer"
                        >
                            Edit
                        </DropdownMenuItem>
                        
                        {/* View Action */}
                        <DropdownMenuItem 
                            onClick={() => navigation('/my-resume/' + resume.attributes.resumeId + "/view")}
                            className="hover:bg-slate-700 cursor-pointer"
                        >
                            View / Share
                        </DropdownMenuItem>

                        {/* Download Action (Placeholder navigation) */}
                        <DropdownMenuItem 
                            onClick={() => toast.info("Download functionality coming soon!")}
                            className="hover:bg-slate-700 cursor-pointer"
                        >
                            Download
                        </DropdownMenuItem>

                        {/* Delete Action (Opens Alert Dialog) */}
                        <DropdownMenuItem 
                            onClick={() => setOpenAlert(true)}
                            className="text-red-400 hover:bg-red-900/40 hover:text-red-300 cursor-pointer"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* --- Delete Confirmation Alert Dialog --- */}
            <AlertDialog open={openAlert}>
                <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-red-400">
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This action cannot be undone. This will **permanently delete** your resume and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {/* Cancel Button */}
                        <AlertDialogCancel 
                            onClick={() => setOpenAlert(false)}
                            className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                        >
                            Cancel
                        </AlertDialogCancel>
                        
                        {/* Delete Button (Red, High Contrast) */}
                        <AlertDialogAction 
                            onClick={onDelete} 
                            disabled={loading}
                            className="bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                            {loading ? <Loader2Icon className='animate-spin h-4 w-4' /> : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ResumeCardItem