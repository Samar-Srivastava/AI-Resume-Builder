import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from './../../../../../service/GlobalApi';
import dummy from '@/data/dummy';

function EditResume() {
    const { resumeId } = useParams();
    const [resumeInfo, setResumeInfo] = useState();

    useEffect(() => {
        GetResumeInfo(); 
    }, []); // Only call GetResumeInfo once when the component mounts

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
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
                {/* Form Section */}
                <FormSection />

                {/* Preview Section */}
                <ResumePreview />
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default EditResume;
