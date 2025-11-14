import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useUser } from '@clerk/clerk-react'; // Import useUser to check authentication state
import Header from '@/components/Custom/Header'; 

// --- Reusable Animated Component ---
const AnimatedSection = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      {children}
    </motion.div>
  );
};

// --- Icon Components (from Heroicons) ---
const BoltIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);
const PaintBrushIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.433 2.433c-.498.057-.98.08-1.467.08c-.709 0-1.407-.064-2.08-.19a.75.75 0 0 1-.6-1.353c.345-.345.672-.7.98-1.07.309-.371.6-.75.88-1.138 1.13-1.488 2.54-2.71 4.14-3.743.15-.1.3-.19.44-.28a.75.75 0 0 1 .71-.03c.14.07.27.16.39.27.2.18.39.37.56.57.17.2.33.4.48.62.15.22.29.45.42.68.13.23.25.47.36.72.11.25.21.5.3.76.09.26.17.53.24.8.07.27.13.55.19.82.06.27.11.55.15.83.04.28.08.56.11.85.03.29.05.59.07.89.02.3.03.6.04.9c.01.3.01.6.01.9 0 .3-.01.6-.02.9a2.25 2.25 0 0 1-2.433-2.433c.01-.11.01-.22.01-.33 0-.41-.05-.81-.13-1.2a3 3 0 0 0-5.78-1.127Z" />
  </svg>
);
const LockClosedIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m.75 1.5h10.5a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-.75-.75H7.5a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75Z" />
  </svg>
);


function Home() {
  const { isSignedIn } = useUser();
  
  // Dynamic link destination
  const ctaLink = isSignedIn ? '/dashboard' : '/auth/sign-in';

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200 font-sans overflow-x-hidden">
      
      {/* --- Header --- */}
      <Header />

      {/* --- Hero Section --- */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 container mx-auto px-6 text-center">
        {/* Background Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl opacity-30"></div>

        <AnimatedSection>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="block text-white">Stop Guessing.</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-600">
              Start Impressing.
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Our AI analyzes top-tier resumes and job descriptions to craft a professional, ATS-beating resume that lands you interviews.
          </p>
          <div className="mt-10">
            <Link
              to={ctaLink} // Use the dynamic link here
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-cyan-500/50"
            >
              Start Building for Free
            </Link>
            <p className="mt-8 text-sm text-slate-400">Your data is secured and encrypted</p>
          </div>
        </AnimatedSection>

        {/* --- Social Proof (Placeholder) --- */}
        <AnimatedSection delay={0.2}>
          <div className="mt-20">
            <p className="text-sm uppercase tracking-wider text-slate-400">
              Trusted by professionals at top companies
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* --- Interactive Demo Section --- */}
      <section id="demo" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-extrabold text-white">See the AI in Action</h2>
              <p className="mt-4 text-lg text-slate-300">
                Go from "managed a team" to a quantifiable, high-impact statement that recruiters can't ignore.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="mt-12 flex flex-col md:flex-row gap-8 items-center justify-center">
              
              {/* "Before" Card */}
              <div className="w-full md:w-1/2 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-lg font-semibold text-red-400">Your Original Point</h3>
                <div className="mt-4 p-4 bg-slate-950 rounded-md text-slate-300 h-24">
                  - Senior Software Developer.
                </div>
              </div>

              {/* Arrow */}
              <div className="transform rotate-90 md:rotate-0">
                <BoltIcon className="w-10 h-10 text-cyan-400" />
              </div>

              {/* "After" Card */}
              <div className="w-full md:w-1/2 p-6 bg-slate-800 rounded-xl border border-cyan-500 shadow-2xl shadow-cyan-500/20">
                <h3 className="text-lg font-semibold text-cyan-400">AI-Generated Improvement</h3>
                <div className="mt-4 p-4 bg-slate-950 rounded-md text-slate-100 h-24">
                  - Highly accomplished Senior Software Developer with 8+ years of extensive experience leading complex software projects from concept to deployment. 
                </div>
              </div>

            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-extrabold text-white">Your Personal Career Co-pilot</h2>
              <p className="mt-4 text-lg text-slate-300">
                This is more than a text editor. Our platform gives you the tools and intelligence to build a truly compelling career story.
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Smart Rewriter */}
            <AnimatedSection delay={0.1}>
              <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-12 h-12 mb-5">
                  <BoltIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Smart Rewriter</h3>
                <p className="mt-2 text-slate-300">Generate high-impact bullet points and summaries from simple phrases. Powered by the latest AI models.</p>
              </div>
            </AnimatedSection>
            {/* Feature 2: Designer Templates */}
            <AnimatedSection delay={0.2}>
              <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-12 h-12 mb-5">
                  <PaintBrushIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Designer Templates</h3>
                <p className="mt-2 text-slate-300">Choose from a library of professional, field-tested templates that are both beautiful and ATS-friendly.</p>
              </div>
            </AnimatedSection>
            {/* Feature 3: Secure Workspace */}
            <AnimatedSection delay={0.3}>
              <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-12 h-12 mb-5">
                  <LockClosedIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Your Secure Workspace</h3>
                <p className="mt-2 text-slate-300">
                  Create a free account to save your progress. Your data is encrypted and synced, so you can pick up where you left off—from any device, anywhere.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="py-24 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-extrabold text-white">Start in 3 Easy Steps</h2>
            <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
              Go from blank page to job-ready resume in minutes.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <AnimatedSection delay={0.1}>
              <div className="p-8 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-slate-900 to-slate-700 rounded-full border border-cyan-500">
                  <span className="text-3xl font-bold text-cyan-400">1</span>
                </div>
                <h3 className="mt-6 text-2xl font-bold text-white">Select Template or Continue</h3>
                  <p className="mt-2 text-slate-300">
                    Choose a professional template from our library to start fresh, or pick up instantly 
                    where you left off on your last saved resume.
                  </p>
                </div>
            </AnimatedSection>
            {/* Step 2 */}
            <AnimatedSection delay={0.2}>
              <div className="p-8 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-slate-900 to-slate-700 rounded-full border border-indigo-500">
                  <span className="text-3xl font-bold text-indigo-400">2</span>
                </div>
                <h3 className="mt-6 text-2xl font-bold text-white">Let the AI Assist</h3>
                <p className="mt-2 text-slate-300">Use our smart tools to rewrite sections, get instant feedback, and tailor your resume to a specific job.</p>
              </div>
            </AnimatedSection>
            {/* Step 3 */}
            <AnimatedSection delay={0.3}>
              <div className="p-8 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-slate-900 to-slate-700 rounded-full border border-pink-500">
                  <span className="text-3xl font-bold text-pink-400">3</span>
                </div>
                <h3 className="mt-6 text-2xl font-bold text-white">Download & Apply</h3>
                <p className="mt-2 text-slate-300">Export your pixel-perfect resume as a PDF and apply for your dream job with confidence.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>


      {/* --- Final CTA Section --- */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-5xl font-extrabold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-600">
                Ready to Land Your Dream Job?
              </span>
            </h2>
            <p className="mt-6 text-xl text-slate-300 max-w-xl mx-auto">
              Your next career move is one click away. Build the resume that gets you in the door.
            </p>
            <div className="mt-10">
              <Link
                to={ctaLink} // Use the dynamic link here as well
                className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-cyan-500/50"
              >
                Start Building Now (It's Free)
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 py-4">
        <div className="container mx-auto px-6 text-center text-slate-400">
          <p>&copy; 2024 AI Resume Builder. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;