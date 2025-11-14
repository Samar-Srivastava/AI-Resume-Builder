import { Loader2, PlusSquare } from 'lucide-react';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    // DialogTrigger is removed as we are using a manual click handler
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function AddResume() {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onCreate = async () => {
        if (!resumeTitle) return; 
        setLoading(true);

        const uuid = uuidv4(); 
        const data = {
            data: {
                title: resumeTitle,
                resumeId: uuid,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName,
                // Add a default content structure if your API needs it
                document: '{"children":[{"type":"p","children":[{"text":""}]}]}'
            }
        };

        try {
            const resp = await GlobalApi.CreateNewResume(data);
            if (resp) {
                setLoading(false);
                setOpenDialog(false); 
                // Navigate to the edit screen upon successful creation
                navigate(`/dashboard/resume/${uuid}/edit`);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error creating resume:', error.response?.data || error.message);
            // Optionally show a toast notification here
        }
    };

    return (
        <div>
            {/* --- The Interactive Add Card --- */}
            <div
                className='p-14 py-24 
                flex flex-col items-center justify-center 
                bg-slate-900 text-cyan-400 
                rounded-xl h-[280px] w-full
                border-2 border-dashed border-slate-700
                hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20
                hover:scale-[1.02] transition-all duration-300
                cursor-pointer'
                onClick={() => {
                    setOpenDialog(true);
                    setResumeTitle(''); // Reset title on opening
                }}
            >
                <PlusSquare className='h-10 w-10 mb-3' />
                <h3 className='text-xl font-semibold text-white'>
                    Create New Resume
                </h3>
                <p className='text-sm text-slate-400 mt-1'>
                    Start from a blank canvas.
                </p>
            </div>

            {/* --- Dialog Modal (Styled for Dark Theme) --- */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                {/* NOTE: DialogContent needs custom styling or a theme wrapper 
                  (like shadcn's dark theme) to properly look dark.
                  I'm adding bg-slate-800 and text-gray-200 for local Tailwind overrides.
                */}
                <DialogContent className="bg-slate-800 text-gray-200 border-slate-700">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white mb-2">
                            Name Your Resume 📄
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            <p>Give your new resume a clear, professional title.</p>
                            <Input
                                className="my-4 bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder="e.g., Senior Software Engineer (Targeted)"
                                value={resumeTitle}
                                onChange={(e) => setResumeTitle(e.target.value)}
                                // Allow Enter key to trigger creation
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && resumeTitle && !loading) {
                                        onCreate();
                                    }
                                }}
                            />
                        </DialogDescription>
                        
                        {/* Action Buttons */}
                        <div className='flex justify-end gap-3 mt-4'>
                            {/* Cancel Button */}
                            <Button 
                                onClick={() => setOpenDialog(false)} 
                                variant="ghost" 
                                className="text-slate-400 hover:bg-slate-700"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            
                            {/* Create Button (Gradient) */}
                            <Button
                                disabled={!resumeTitle.trim() || loading}
                                onClick={onCreate}
                                // Apply the gradient style to the button
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-600 hover:to-blue-700 transition-colors"
                            >
                                {loading ? (
                                    <div className='flex items-center gap-2'>
                                        <Loader2 className='h-4 w-4 animate-spin' /> Creating...
                                    </div>
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddResume;