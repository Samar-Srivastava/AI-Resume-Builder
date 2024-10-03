import Header from '@/components/Custom/Header';
import React from 'react';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-100 to-orange-100 font-sans">
      {/* Custom Header Component */}
      <Header />

      {/* Main Section */}
      <div className="container mx-auto text-center py-20">
        <h1 className="text-5xl font-extrabold text-blue-400">
          Build Your Ultimate AI-Powered Resume
        </h1>
        <p className="mt-6 text-lg text-orange-600">
          Craft professional, ATS-friendly resumes in minutes with our AI-driven platform.
        </p>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 border rounded-lg hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-red-600">AI-Powered</h2>
            <p className="mt-2 text-gray-600">Use advanced AI to build a resume that stands out.</p>
          </div>
          <div className="p-8 border rounded-lg hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-orange-600">Customizable</h2>
            <p className="mt-2 text-gray-600">Tailor every section to match your unique needs.</p>
          </div>
          <div className="p-8 border rounded-lg hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-pink-600">Instant Feedback</h2>
            <p className="mt-2 text-gray-600">Get AI-driven tips for improvements in real time.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-orange-50 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-red-800">How It Works</h2>
          <p className="mt-4 text-lg text-orange-600">
            Create your professional resume in 3 easy steps.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border rounded-lg hover:shadow-md transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-red-600">Step 1</h3>
              <p className="mt-2 text-gray-600">Enter your details and experience.</p>
            </div>
            <div className="p-8 bg-white border rounded-lg hover:shadow-md transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-orange-600">Step 2</h3>
              <p className="mt-2 text-gray-600">Pick a professional template.</p>
            </div>
            <div className="p-8 bg-white border rounded-lg hover:shadow-md transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-pink-600">Step 3</h3>
              <p className="mt-2 text-gray-600">Download your optimized resume instantly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Section with Blue Hint */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-blue-700">Why Choose Us?</h2>
          <p className="mt-4 text-lg text-blue-600">
            Experience a seamless and efficient way to create your resume.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-red-600 py-6 text-center text-white">
        <p>&copy; 2024 AI Resume Builder. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
