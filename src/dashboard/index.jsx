import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import GlobalApi from './../../service/GlobalApi'
import { useUser } from '@clerk/clerk-react'
import ResumeCardItem from './components/ResumeCardItem';

function Dashboard() {
  
  const {user}=useUser();
  const [resumeList,setResumeList]=useState([]);

  useEffect(()=>{
    user&&GetResumesList()},[user]
  )
  const GetResumesList=()=>{
    GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
    .then(resp=>{
      console.log(resp.data.data)
      setResumeList(resp.data.data);
    })
  }
  return (
    <div className='p-10 md:px-20 lg:px-32'>
        <h2 className='font-bold text-3xl'>My Resume</h2>
        <p>Start Creating AI resume to your next Job role</p>
        <div className='grid grid-cols-2 
        md:grid-cols-4 lg:grid-col-5 gap-5
        mt-10'>
        <AddResume/>
        {/* {resumeList.length>0&&resumeList.map((resume,index)=>(
          <ResumeCardItem resume={resume} key={index}/>
        ))} */}
        {resumeList.length>0&&resumeList.map((resume,index)=>(
        <ResumeCardItem resume={resume} key={index} refreshData={GetResumesList}/>))}
        </div>

    </div>
  )
}

export default Dashboard