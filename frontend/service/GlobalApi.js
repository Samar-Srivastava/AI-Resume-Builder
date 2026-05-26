import axios from 'axios';

const API_BASE = '/api';

let getAuthToken = null;

/** Called once from AuthTokenProvider with Clerk getToken */
export function setAuthTokenGetter(getter) {
  getAuthToken = getter;
}

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  if (getAuthToken) {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const publicClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

const CreateNewResume = (data) => axiosClient.post('/resumes', data);

const GetUserResumes = () => axiosClient.get('/resumes');

const GetResumeByResumeId = (resumeId) =>
  axiosClient.get(`/resumes/${encodeURIComponent(resumeId)}`);

const UpdateResumeDetail = (resumeId, data) =>
  axiosClient.put(`/resumes/${encodeURIComponent(resumeId)}`, data);

const DeleteResumeByResumeId = (resumeId) =>
  axiosClient.delete(`/resumes/${encodeURIComponent(resumeId)}`);

/** Public share link — no auth; resume must have isPublic: true */
const GetPublicResume = (resumeId) =>
  publicClient.get(`/resumes/public/${encodeURIComponent(resumeId)}`);

export default {
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetail,
  GetResumeByResumeId,
  DeleteResumeByResumeId,
  GetPublicResume,
};
