import { Loader2Icon, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import GlobalApi from './../../../service/GlobalApi';
import { toast } from 'sonner';
import { getTemplate } from '@/lib/resumeTemplates';
import ResumeCardThumbnail from '@/components/ResumeCardThumbnail';

function ResumeCardItem({ resume, refreshData }) {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const themeColor = resume.attributes.themeColor || '#6366f1';
  const templateName = getTemplate(resume.attributes.templateId || 'classic').name;
  const resumeId = resume.attributes.resumeId;

  const onDelete = () => {
    if (!resumeId) {
      toast.error('Resume ID is missing. Cannot delete the resume.');
      return;
    }

    setLoading(true);
    GlobalApi.DeleteResumeByResumeId(resumeId)
      .then(() => {
        toast.success('Resume deleted successfully!');
        refreshData();
        setOpenAlert(false);
      })
      .catch(() => {
        toast.error('Failed to delete the resume.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="group relative w-full">
      <Link to={`/dashboard/resume/${resumeId}/edit`}>
        <div
          className="p-4 flex flex-col h-[280px] bg-slate-800 rounded-t-xl border-t-4 border-x border-slate-700 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
          style={{
            borderTopColor: themeColor,
            boxShadow: `0 8px 15px -3px ${themeColor}44`,
          }}
        >
          <ResumeCardThumbnail resume={resume} />

          <h3 className="text-sm font-semibold text-slate-300 mt-3 truncate group-hover:text-white transition-colors">
            {resume.attributes.title}
          </h3>
          <p className="text-xs text-slate-500">{templateName} template</p>

          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
            style={{
              background: `linear-gradient(to bottom right, ${themeColor}AA, transparent 80%)`,
            }}
          />
        </div>
      </Link>

      <div
        className="p-3 flex justify-between items-center rounded-b-xl border-x border-b border-slate-700"
        style={{ backgroundColor: themeColor }}
      >
        <h2 className="text-sm font-semibold text-white truncate max-w-[70%]">
          {resume.attributes.title}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-5 w-5 cursor-pointer text-white hover:text-gray-200" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-slate-700 text-gray-200">
            <DropdownMenuItem
              onClick={() => navigation(`/dashboard/resume/${resumeId}/edit`)}
              className="hover:bg-slate-700 cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigation(`/my-resume/${resumeId}/view`)}
              className="hover:bg-slate-700 cursor-pointer"
            >
              View / Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigation(`/my-resume/${resumeId}/view`)}
              className="hover:bg-slate-700 cursor-pointer"
            >
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpenAlert(true)}
              className="text-red-400 hover:bg-red-900/40 hover:text-red-300 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-400">
              Delete this resume?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This cannot be undone. Your resume data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? <Loader2Icon className="animate-spin h-4 w-4" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ResumeCardItem;
