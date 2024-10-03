import { Loader2Icon, MoreVertical, Notebook } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import GlobalApi from './../../../service/GlobalApi';
import { toast } from 'sonner';

function ResumeCardItem({resume,refreshData}) {
  const navigation=useNavigate();
  const[loading,setLoading]=useState(false);
  const [openAlert,setOpenAlert]=useState(false);
  // const onDelete=()=>{
  //   setLoading(true);
  //   GlobalApi.DeleteResumeByResumeId(resume.documentId).then(resp=>{
  //     console.log(resp);
  //     toast("Resume Deleted! ");
  //     refreshData()
  //     setLoading(false);
  //     setOpenAlert(false);
  //   },(error)=>{
  //     setLoading(false);
  //   })
  // }

   // Log the resume object to see what's available
   console.log("Resume data:", resume);

   const onDelete = () => {
     const resumeId = resume.attributes.resumeId; // Use the correct field here
     console.log("Attempting to delete resume with resumeId:", resumeId);
 
     if (!resumeId) {
       toast.error("Resume ID is missing. Cannot delete the resume.");
       return;
     }
 
     setLoading(true);
     GlobalApi.DeleteResumeByResumeId(resumeId)
       .then(resp => {
         console.log(resp);
         toast.success("Resume Deleted!");
         refreshData();
         setLoading(false);
         setOpenAlert(false);
       })
       .catch(error => {
         console.error("Error deleting resume:", error.message);
         toast.error("Error deleting the resume.");
         setLoading(false);
       });
   };
 



  return (
    <div>
    <Link to={'/dashboard/resume/'+resume.attributes.resumeId+"/edit"}>
        <div className='p-14 bg-gradient-to-b
        from-pink-100 via-purple-200 to-blue-200 
        flex
        items-center justify-center h-[280px]
          rounded-lg border-t-4 
        hover:scale-105 translate-all 
        hover:shadow-md shadow-primary'
            style={{
              borderColor:resume.attributes.themeColor
            }}
            >
              <div className='flex items-center justify-center h-[180px]'>
              <img src="/cv.png" width={80} height={80} />
              </div>
        </div>
    </Link>
    <div className='border p-3 flex justify-between  text-white rounded-b-lg shadow-lg'
         style={{
          background:resume.attributes.themeColor
        }}>
          <h2 className='text-sm'>{resume.attributes.title}</h2>
        
        <DropdownMenu>
        <DropdownMenuTrigger>
        <MoreVertical className='h-4 w-4 cursor-pointer'/>
        </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem  onClick={()=>navigation('/dashboard/resume/'+resume.attributes.resumeId+"/edit")}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>navigation('/my-resume/'+resume.attributes.resumeId+"/view")}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>navigation('/my-resume/'+resume.attributes.resumeId+"/view")}>Download</DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>setOpenAlert(true)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your resume
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={loading}>
              {loading? <Loader2Icon className='animate-spin'/>:'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
    </div>
  )
}

export default ResumeCardItem