import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from '@/components/Custom/Header';
import {
  Sparkles,
  LayoutTemplate,
  ShieldCheck,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';

const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

function Home() {
  const { isSignedIn } = useUser();
  const ctaLink = isSignedIn ? '/dashboard' : '/auth/sign-in';

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200 font-sans overflow-x-hidden">
      <Header />

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 container mx-auto px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

        <AnimatedSection>
          <p className="text-sm uppercase tracking-widest text-cyan-400 mb-4">
            AI Resume Builder
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Build resumes that{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
              recruiters and ATS can read
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Three professional templates, AI-assisted summaries and experience bullets,
            and a live ATS checklist—so you know what to fix before you apply.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={ctaLink}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              {isSignedIn ? 'Go to Dashboard' : 'Start Building — Free'}
            </Link>
            <a
              href="#features"
              className="text-slate-400 hover:text-cyan-400 text-sm font-medium flex items-center gap-1"
            >
              See what&apos;s included <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Secure sign-in with Clerk · Resumes stored in your private workspace
          </p>
        </AnimatedSection>
      </section>

      <section id="demo" className="py-20 bg-slate-900/80 border-y border-slate-800">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold text-white">AI writing, real example</h2>
              <p className="mt-3 text-slate-400">
                Turn a plain line into a stronger bullet—then tune it with the built-in editor.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-xs font-semibold text-red-400 uppercase mb-2">Before</p>
                <p className="text-slate-300 text-sm italic">
                  &ldquo;Senior Software Developer.&rdquo;
                </p>
              </div>
              <div className="p-6 bg-slate-800 rounded-xl border border-cyan-500/50 shadow-lg shadow-cyan-500/10">
                <p className="text-xs font-semibold text-cyan-400 uppercase mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> After AI assist
                </p>
                <p className="text-slate-200 text-sm">
                  Led full-stack delivery for customer-facing products; improved release
                  cadence and mentored engineers across 3 squads.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl font-extrabold text-white text-center">
              What you get today
            </h2>
            <p className="text-center text-slate-400 mt-2 max-w-xl mx-auto">
              No vague promises—features that are in the app right now.
            </p>
          </AnimatedSection>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'AI assist',
                desc: 'Generate summaries and experience bullets from your job title and role.',
                color: 'from-cyan-500 to-blue-600',
              },
              {
                icon: LayoutTemplate,
                title: '3 templates',
                desc: 'Classic, Modern sidebar, and Minimal ATS-friendly layouts.',
                color: 'from-indigo-500 to-purple-600',
              },
              {
                icon: ClipboardCheck,
                title: 'ATS checklist',
                desc: 'Live score, fix list, and optional job-description keyword match.',
                color: 'from-emerald-500 to-teal-600',
              },
              {
                icon: ShieldCheck,
                title: 'Secure workspace',
                desc: 'Clerk authentication and server-side API—your keys stay off the browser.',
                color: 'from-green-500 to-emerald-600',
              },
            ].map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.08}>
                <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 h-full hover:border-slate-600 transition-colors">
                  <div
                    className={`p-2.5 rounded-lg bg-gradient-to-r ${f.color} w-fit mb-4`}
                  >
                    <f.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl font-extrabold text-white text-center">
              How it works
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Pick a template',
                desc: 'Choose Classic, Modern, or Minimal when you create a resume.',
              },
              {
                step: '2',
                title: 'Fill & improve with AI',
                desc: 'Add details section by section; use AI where you need a boost.',
              },
              {
                step: '3',
                title: 'Check ATS & share',
                desc: 'Use the checklist in the editor, then download or share a public link.',
              },
            ].map((s, i) => (
              <AnimatedSection key={s.step} delay={i * 0.1}>
                <div className="text-center p-6">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-cyan-500 text-cyan-400 font-bold text-xl">
                    {s.step}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-slate-400 text-sm">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-extrabold text-white">
              Ready to build your resume?
            </h2>
            <p className="mt-4 text-slate-400 max-w-lg mx-auto">
              Create an account, pick a template, and see your ATS score update as you go.
            </p>
            <Link
              to={ctaLink}
              className="inline-block mt-8 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              {isSignedIn ? 'Open Dashboard' : 'Get Started'}
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <footer className="bg-slate-900 py-6 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AI Resume Builder · React, Strapi, Clerk, Gemini</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
