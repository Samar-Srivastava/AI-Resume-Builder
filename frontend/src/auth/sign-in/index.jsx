import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Custom/Header';
import { FileText, Shield, Sparkles } from 'lucide-react';

function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-200">
      <Header />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="hidden lg:block space-y-6">
            <h1 className="text-4xl font-extrabold text-white">
              Your resume workspace
            </h1>
            <p className="text-slate-400 text-lg">
              Sign in to build with AI, pick from three templates, and track your ATS score.
            </p>
            <ul className="space-y-4">
              {[
                { icon: Sparkles, text: 'AI summaries and experience bullets' },
                { icon: FileText, text: 'Classic, Modern, and Minimal templates' },
                { icon: Shield, text: 'Private, secure resume storage' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-slate-300">
                  <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-3xl font-bold text-white">Welcome back</h1>
              <p className="mt-2 text-slate-400">
                Sign in to continue building your resume.
              </p>
            </div>
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/50 p-6 shadow-xl">
              <SignIn signUpUrl="/auth/sign-in" forceRedirectUrl="/dashboard" />
            </div>
            <Link to="/" className="mt-8 text-sm text-slate-500 hover:text-cyan-400 transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
