import React, { useEffect, useState } from 'react';
import AddResume from './components/AddResume';
import GlobalApi from './../../service/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import ResumeCardItem from './components/ResumeCardItem';
import ResumeCardSkeleton from './components/ResumeCardSkeleton';
import { motion } from 'framer-motion';

function Dashboard() {
  const { user, isLoaded } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isLoaded) {
      GetResumesList();
    }
  }, [user, isLoaded]);

  const GetResumesList = () => {
    setLoading(true);
    GlobalApi.GetUserResumes()
      .then((resp) => {
        if (Array.isArray(resp.data.data)) {
          setResumeList(resp.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching resumes:', error);
      })
      .finally(() => setLoading(false));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200 p-8 md:px-16 lg:px-24 pt-24">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-6 border-b border-slate-800 mb-10"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-white">
          Welcome back,{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
            {user?.firstName || 'User'}
          </span>
          !
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Create, edit, and track your resumes—all in one place.
        </p>
      </motion.div>

      <h3 className="font-bold text-2xl text-white mb-6">
        My Resumes {loading ? '' : `(${resumeList.length})`}
      </h3>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <AddResume />
        </motion.div>

        {loading &&
          [1, 2, 3].map((i) => (
            <motion.div key={`sk-${i}`} variants={itemVariants}>
              <ResumeCardSkeleton />
            </motion.div>
          ))}

        {!loading &&
          resumeList.map((resume) => (
            <motion.div
              key={resume.attributes?.resumeId || resume.id}
              variants={itemVariants}
            >
              <ResumeCardItem resume={resume} refreshData={GetResumesList} />
            </motion.div>
          ))}

        {!loading && resumeList.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-16 text-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50"
          >
            <p className="text-xl text-slate-400">No resumes yet</p>
            <p className="text-slate-500 mt-2 text-sm">
              Click &ldquo;Create New Resume&rdquo; to pick a template and get started.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Dashboard;
