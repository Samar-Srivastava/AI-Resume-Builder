import axios from 'axios';

// 1. URL CONFIGURATION
const LIVE_API_BASE_URL = import.meta.env.VITE_STRAPI_API_URL;
const LOCAL_API_BASE_URL = 'http://localhost:1337/api/';

const getBaseUrl = () => {
    const baseURL = LIVE_API_BASE_URL || LOCAL_API_BASE_URL;
    // Ensure the base URL always ends with '/api/'
    if (baseURL.endsWith('/')) {
        return baseURL;
    }
    return `${baseURL}/api/`;
};

// 2. CREATE AXIOS CLIENT
const axiosClient = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    }
});

// 3. SMART INTERCEPTOR (The Fix)
// This runs before every request to attach the correct token
axiosClient.interceptors.request.use((config) => {
    
    // Option A: Try to get a User Login Token from Local Storage
    // (This works if you save the token as 'user-token' or 'token' after login)
    const userToken = localStorage.getItem('user-token'); 
    
    // Option B: Fallback to the Static API Key from your .env file
    // (This is what you were trying to use in your original code)
    const apiKey = import.meta.env.VITE_STRAPI_API_KEY;

    // Logic: If user is logged in, use their token. If not, use the API Key.
    const tokenToUse = userToken ? userToken : apiKey;

    if (tokenToUse) {
        config.headers.Authorization = `Bearer ${tokenToUse}`;
    } else {
        // If both are missing, this error will help you debug in the console
        console.warn("⚠️ No Auth Token found! Check your Vercel Environment Variables for VITE_STRAPI_API_KEY");
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});


// 4. API METHODS
const CreateNewResume = (data) => axiosClient.post('/user-resumes', data);

const GetUserResumes = (userEmail) => axiosClient.get(`/user-resumes?filters[userEmail][$eq]=${userEmail}&populate=*`);

const UpdateResumeDetail = async (resumeId, data) => {
    try {
        const response = await axiosClient.get(`/user-resumes?filters[resumeId][$eq]=${resumeId}&populate=*`);
        const resumeData = response.data.data;

        if (!resumeData || resumeData.length === 0) {
            throw new Error('No resume found with the provided resumeId.');
        }

        const internalId = resumeData[0].id;
        const updateResponse = await axiosClient.put(`/user-resumes/${internalId}`, {
            data: data.data
        });
        return updateResponse.data;
    } catch (error) {
        console.error('Error updating resume:', error);
        throw error;
    }
};

const GetResumeByResumeId = (resumeId) => axiosClient.get(`/user-resumes?filters[resumeId][$eq]=${resumeId}&populate=*`);

const DeleteResumeByResumeId = async (resumeId) => {
    try {
        const response = await axiosClient.get(`/user-resumes?filters[resumeId][$eq]=${resumeId}`);
        const resumeData = response.data.data;

        if (!resumeData || resumeData.length === 0) {
            throw new Error('No resume found with the provided resumeId.');
        }

        const internalId = resumeData[0].id;
        const deleteResponse = await axiosClient.delete(`/user-resumes/${internalId}`);
        return deleteResponse.data;
    } catch (error) {
        console.error('Error deleting resume:', error);
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