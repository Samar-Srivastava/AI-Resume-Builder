import { Loader2, PlusSquare } from 'lucide-react';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_TEMPLATE_ID, getTemplate } from '@/lib/resumeTemplates';
import { TemplatePickerGrid } from '@/dashboard/resume/components/TemplatePicker';
import { toast } from 'sonner';

function AddResume() {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState('');
    const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const resetForm = () => {
        setResumeTitle('');
        setTemplateId(DEFAULT_TEMPLATE_ID);
    };

    const onCreate = async () => {
        if (!resumeTitle.trim()) return;
        setLoading(true);

        const uuid = uuidv4();
        const template = getTemplate(templateId);
        const data = {
            data: {
                title: resumeTitle.trim(),
                resumeId: uuid,
                isPublic: false,
                templateId: template.id,
                themeColor: template.defaultColor,
            },
        };

        try {
            await GlobalApi.CreateNewResume(data);
            setOpenDialog(false);
            resetForm();
            navigate(`/dashboard/resume/${uuid}/edit`);
        } catch (error) {
            console.error('Error creating resume:', error.response?.data || error.message);
            toast.error('Could not create resume. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
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
                    resetForm();
                }}
            >
                <PlusSquare className='h-10 w-10 mb-3' />
                <h3 className='text-xl font-semibold text-white'>
                    Create New Resume
                </h3>
                <p className='text-sm text-slate-400 mt-1'>
                    Pick a template and start building.
                </p>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-slate-800 text-gray-200 border-slate-700 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white mb-2">
                            Create New Resume
                        </DialogTitle>
                        <DialogDescription asChild>
                            <div className="text-slate-400 space-y-2">
                                <p>Choose a template and name your resume.</p>
                                <Input
                                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-cyan-500 focus:border-cyan-500"
                                    placeholder="e.g., Senior Software Engineer (Targeted)"
                                    value={resumeTitle}
                                    onChange={(e) => setResumeTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && resumeTitle.trim() && !loading) {
                                            onCreate();
                                        }
                                    }}
                                />
                                <p className="text-sm font-medium text-slate-300 pt-2">Template</p>
                                <TemplatePickerGrid
                                    value={templateId}
                                    onChange={setTemplateId}
                                    disabled={loading}
                                />
                            </div>
                        </DialogDescription>

                        <div className='flex justify-end gap-3 mt-2'>
                            <Button
                                onClick={() => setOpenDialog(false)}
                                variant="ghost"
                                className="text-slate-400 hover:bg-slate-700"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={!resumeTitle.trim() || loading}
                                onClick={onCreate}
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-600 hover:to-blue-700"
                            >
                                {loading ? (
                                    <span className='flex items-center gap-2'>
                                        <Loader2 className='h-4 w-4 animate-spin' /> Creating...
                                    </span>
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
