import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'

function Education() {

    const[eduactionalList,setEducationalList]=useState([
        {
            universityName:'',
            degree:'',
            major:'',
            startdate:'',
            endDate:'',
            description:''
        }
    ])

    
  useEffect(()=>{
    resumeInfo&&setEducationalList(resumeInfo?.education)
  },[])
    const handleChange=(event,index)=>{
        const newEntries=eduactionalList.slice();
        const{name,value}=event.target;
        newEntries[index][name]=value;
        setEducationalList(newEntries);
    }
    const [loading,setLoading]=useState(false);
    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
    const params=useParams();


    const AddEducation=()=>{
        setEducationalList([...eduactionalList,{ 
        universityName:'',
        degree:'',
        major:'',
        startdate:'',
        endDate:'',
        description:''
    }])
    }
    const RemoveEducation=()=>{
        setEducationalList(eduactionalList=>eduactionalList.slice(0,-1))

    }
    const onSave=()=>{
        setLoading(true)
        const data={
            data:{
                education:eduactionalList.map(({id,...rest})=>rest)
            }
        }
        GlobalApi.UpdateResumeDetail(params.resumeId,data).then(resp=>{
            console.log(resp);
            setLoading(false)
            toast('Details updated !')
        },(error)=>{
            setLoading(false);
            toast('Server Error, Please try again!')
        })
    }
    useEffect(()=>{
        setResumeInfo({
            ...resumeInfo,
            education:eduactionalList
        })
    },[eduactionalList])
  return (
    <div>
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Education</h2>
        <p>Add your education details</p>
        <div>
            {eduactionalList.map((item,index)=>(
                <div key={index}>
                    <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                        <div className='col-span-2'>
                            <label>University Name</label>
                            <Input name="universityName" onChange={(e)=>handleChange(e,index)}
                            defaultValue={item.universityName}></Input>
                        </div>
                        <div>
                            <label>Degree</label>
                            <Input name="degree" onChange={(e)=>handleChange(e,index)}
                            defaultValue={item.degree}></Input>
                        </div>
                        <div>
                            <label>Major</label>
                            <Input name="major" onChange={(e)=>handleChange(e,index)}
                            defaultValue={item.major}></Input>
                        </div>
                        <div>
                            <label>Start Date</label>
                            <Input type="date" name="startDate" onChange={(e)=>handleChange(e,index)}
                            defaultValue={item.startDate}></Input>
                        </div>
                        <div>
                            <label>End Date</label>
                            <Input type="date" name="endDate" onChange={(e)=>handleChange(e,index)}
                            defaultValue={item.endDate}></Input>
                        </div>
                        <div className='col-span-2'>
                            <label>Description</label>
                            <Textarea name="description" onChange={(e)=>handleChange(e,index)}
                            defaultValue={item.description}></Textarea>
                        </div>
                    </div>
                   
                    
                </div>
            ))}
        </div>
        <div className='flex justify-between'>
                        <div className='col-span-2'>
                        <Button variant='outline' onClick={AddEducation} className="text-primary">+ Add Education</Button>
                        <Button variant='outline' onClick={RemoveEducation} className="text-primary">- Remove</Button>
                        </div>
                        <Button disabled={loading} onClick={()=>onSave()}>
                            {loading?<LoaderCircle className='animate-spin' />:'Save'}    
                        </Button>
                    </div>
        </div>

    </div>
  )
}

export default Education