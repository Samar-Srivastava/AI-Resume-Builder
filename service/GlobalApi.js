import axios from 'axios';

// Ensure the API key is available
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

const axiosClient = axios.create({
    baseURL: 'http://localhost:1337/api/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

// Create a new resume
const CreateNewResume = (data) => axiosClient.post('/user-resumes',data);
// Get resumes by user email
const GetUserResumes = (userEmail) => axiosClient.get(`/user-resumes?filters[userEmail][$eq]=${userEmail}&populate=*`);

// Update resume by resumeId (UUID)
const UpdateResumeDetail = async (resumeId, data) => {
    try {
        // Fetch the resume by resumeId (UUID)
        const response = await axiosClient.get(`/user-resumes?filters[resumeId][$eq]=${resumeId}&populate=*`);

        const resumeData = response.data.data;

        if (resumeData.length === 0) {
            throw new Error('No resume found with the provided resumeId.');
        }

        // Extract the internal ID (integer) that Strapi uses
        const internalId = resumeData[0].id;

        console.log('Internal ID of resume to update:', internalId);

        // Update the resume using the internal ID
        const updateResponse = await axiosClient.put(`/user-resumes/${internalId}`, {
            data: data.data
        });

        return updateResponse.data;
    } catch (error) {
        console.error('Error updating resume:', error.message);
        throw error;
    }
};

// Get resume by resumeId (UUID)
const GetResumeByResumeId = (resumeId) => axiosClient.get(`/user-resumes?filters[resumeId][$eq]=${resumeId}&populate=*`);

// Delete resume by internal ID
const DeleteResumeByResumeId = async (resumeId) => {
    try {
        // Fetch the resume by resumeId (UUID) to ensure it exists
        const response = await axiosClient.get(`/user-resumes?filters[resumeId][$eq]=${resumeId}`);
        const resumeData = response.data.data;

        if (resumeData.length === 0) {
            console.error('No resume found with the provided resumeId:', resumeId);
            throw new Error('No resume found with the provided resumeId.');
        }

        // Extract the internal Strapi ID
        const internalId = resumeData[0].id;

        // Delete the resume using the internal ID
        const deleteResponse = await axiosClient.delete(`/user-resumes/${internalId}`);

        return deleteResponse.data;
    } catch (error) {
        console.error('Error deleting resume:', error.message);
        throw error;
    }
};


export default {
    CreateNewResume,
    GetUserResumes,
    UpdateResumeDetail,
    GetResumeByResumeId,
    DeleteResumeByResumeId
};
