import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import GlobalApi from './../../../../service/GlobalApi';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import Header from '@/components/Custom/Header';
import ResumeScoreDisplay from '@/components/ResumeScoreDisplay';
import { Button } from '@/components/ui/button';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import { useResumeScore } from '@/hooks/useResumeScore';
import { RWebShare } from 'react-web-share';
import { Download, Share2, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';

function ViewResume() {
    const [resumeInfo, setResumeInfo] = useState(null);
    const [shareLoading, setShareLoading] = useState(false);
    const { resumeId } = useParams();
    const { isSignedIn, isLoaded } = useUser();

    const { bundle: scoreBundle, loading: scoreLoading } = useResumeScore(
        resumeInfo,
        resumeId,
        { enabled: !!resumeInfo, isSignedIn: !!isSignedIn }
    );

    useEffect(() => {
        if (isLoaded) {
            GetResumeInfo();
        }
    }, [resumeId, isSignedIn, isLoaded]);

    const GetResumeInfo = () => {
        const request = isSignedIn
            ? GlobalApi.GetResumeByResumeId(resumeId)
            : GlobalApi.GetPublicResume(resumeId);

        request
            .then((resp) => {
                const attrs = resp.data?.data?.attributes ?? resp.data?.data;
                if (attrs) {
                    setResumeInfo({
                        ...attrs,
                        templateId: attrs.templateId || 'classic',
                    });
                } else {
                    toast.error('Resume not found or access denied.');
                }
            })
            .catch((error) => {
                const msg = error.response?.data?.error;
                toast.error(msg || 'Failed to load resume. Enable public sharing if this is a shared link.');
            });
    };

    const togglePublicShare = async () => {
        if (!isSignedIn) return;
        setShareLoading(true);
        try {
            await GlobalApi.UpdateResumeDetail(resumeId, {
                data: { isPublic: !resumeInfo?.isPublic },
            });
            setResumeInfo((prev) => ({ ...prev, isPublic: !prev?.isPublic }));
            toast.success(
                resumeInfo?.isPublic
                    ? 'Link is now private'
                    : 'Anyone with the link can view this resume'
            );
        } catch {
            toast.error('Could not update sharing settings');
        } finally {
            setShareLoading(false);
        }
    };

    const HandleDownload = () => {
        window.print();
    };

    const resumeTitle =
        resumeInfo?.firstName && resumeInfo?.lastName
            ? `${resumeInfo.firstName} ${resumeInfo.lastName}'s Resume`
            : 'AI Generated Resume';

    const shareUrl = `${import.meta.env.VITE_BASE_URL || window.location.origin}/my-resume/${resumeId}/view`;

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div className='min-h-screen bg-slate-950 text-gray-200'>
                <div id="no-print" className='w-full'>
                    <Header />

                    <div className='container mx-auto text-center py-16 px-4 pt-28'>
                        <h2 className='text-4xl font-extrabold'>
                            <span className='bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-600'>
                                Congrats! Your Resume is Ready
                            </span>
                        </h2>
                        <p className='mt-4 text-lg text-slate-400 max-w-2xl mx-auto'>
                            Download your resume or share a link with recruiters.
                            {!resumeInfo?.isPublic && (
                                <span className='block mt-2 text-amber-400/90 text-sm'>
                                    Turn on public sharing below before sending the link to others.
                                </span>
                            )}
                        </p>

                        <div className="mt-8">
                            <ResumeScoreDisplay
                                bundle={scoreBundle}
                                loading={scoreLoading}
                                showBreakdown={!scoreLoading}
                            />
                        </div>

                        {isSignedIn && resumeInfo && (
                            <div className='mt-6 flex justify-center'>
                                <Button
                                    variant="outline"
                                    onClick={togglePublicShare}
                                    disabled={shareLoading}
                                    className='border-slate-600 text-slate-200'
                                >
                                    {resumeInfo.isPublic ? (
                                        <Lock className='h-4 w-4 mr-2' />
                                    ) : (
                                        <Globe className='h-4 w-4 mr-2' />
                                    )}
                                    {resumeInfo.isPublic ? 'Make link private' : 'Enable public share link'}
                                </Button>
                            </div>
                        )}

                        <div className='flex flex-wrap justify-center gap-6 mt-10'>
                            <Button
                                onClick={HandleDownload}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-md rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                            >
                                <Download className='h-5 w-5 mr-2' /> Download PDF
                            </Button>

                            <RWebShare
                                data={{
                                    text: 'Check out my professional resume.',
                                    url: shareUrl,
                                    title: resumeTitle,
                                }}
                            >
                                <Button
                                    disabled={!resumeInfo?.isPublic}
                                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white font-bold text-md rounded-full shadow-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50"
                                >
                                    <Share2 className='h-5 w-5 mr-2' /> Share Link
                                </Button>
                            </RWebShare>
                        </div>
                    </div>
                </div>

                <div className='mb-1 container mx-auto px-4'>
                    {resumeInfo ? (
                        <div id='print-area' className='shadow-2xl mx-auto max-w-4xl bg-white rounded-lg overflow-hidden'>
                            <ResumePreview />
                        </div>
                    ) : (
                        <p className='text-center text-slate-400 py-20'>Loading resume…</p>
                    )}
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default ViewResume;
