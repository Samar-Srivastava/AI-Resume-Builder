import Header from '@/components/Custom/Header'
import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../service/GlobalApi';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import { RWebShare } from 'react-web-share';

function ViewResume() {

  const [resumeInfo,setResumeInfo]=useState();
  const {resumeId}=useParams();

  useEffect(()=>{
    GetResumeInfo();
  },[])

  const HandleDownload=()=>{
    window.print();
}
   const GetResumeInfo = () => {
        GlobalApi.GetResumeByResumeId(resumeId)
            .then(resp => {
                console.log("Fetched Data:", resp.data); // Log the fetched data
    
                // Check if resp.data.data is an array
                if (Array.isArray(resp.data.data)) {
                    // Find the matching resume
                    const fetchedResume = resp.data.data.find(resume => resume.attributes.resumeId === resumeId);
                    
                    if (fetchedResume) {
                        console.log("Matching Resume:", fetchedResume.attributes); // Log the attributes of the matched resume object
                        setResumeInfo(fetchedResume.attributes); // Update state with the resume attributes
                    } else {
                        console.log("No resume found with the provided resumeId."); // Handle case where no match is found
                    }
                } else {
                    console.error("Expected resp.data.data to be an array but got:", resp.data.data); // Log error if data is not an array
                }
            })
            .catch(error => {
                console.error("Error fetching resume info:", error); // Log any errors
            });
    };
  return (
    <ResumeInfoContext.Provider value={{resumeInfo,setResumeInfo}}>
      <div id="no-print">
      <Header/>
      <div className='my-10 md:mx-20 lg:mx-36'>
        <h2 className='text-center text-2xl font-medium'>
          Congrats! Your Ultimate AI generated Resume is ready ! </h2>
          <p className='text-center text-gray-400'>Now you are ready to download your resume and you can share unique 
                    resume url with your friends and family</p>
        <div className='flex justify-between px-44 my-10'>
          <Button onClick={HandleDownload}>Download</Button>
          <RWebShare
        data={{
          text: "Hello Everyone, This is my resume please open url to see it",
          url: import.meta.env.VITE_BASE_URL+"/my-resume/"+resumeId+"/view",
          title: resumeInfo?.firstName+" "+resumeInfo?.lastName+" resume",
        }}
        onClick={() => console.log("shared successfully!")}
      >
        <Button>Share</Button>
      </RWebShare>
        </div>
        </div>
      </div>
      <div className='my-10 md:mx-20 lg:mx-36'>
        <div id='print-area'>
          <ResumePreview/>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default ViewResume