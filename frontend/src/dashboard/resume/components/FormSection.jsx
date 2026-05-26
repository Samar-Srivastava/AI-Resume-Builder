import React, { useState } from 'react';
import PersonalDetail from './forms/PersonalDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import Summery from './forms/Summery';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import { Link, Navigate, useParams } from 'react-router-dom';
import ThemeColor from './ThemeColor';
import TemplatePicker from './TemplatePicker';
import FormStepper from './FormStepper';

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enabledNext, setEnableNext] = useState(false);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const { resumeId } = useParams();

  const goToStep = (step) => {
    setActiveFormIndex(step);
  };

  const goNext = () => {
    const next = activeFormIndex + 1;
    setActiveFormIndex(next);
    setMaxStepReached((m) => Math.max(m, next));
    if (next > 1) setEnableNext(next <= 2);
  };

  const handleEnabledNext = (v) => {
    setEnableNext(v);
    if (v && activeFormIndex >= maxStepReached) {
      setMaxStepReached(activeFormIndex + 1);
    }
  };

  return (
    <div>
      <FormStepper
        activeStep={Math.min(activeFormIndex, 5)}
        maxReachable={maxStepReached}
        onStepClick={(step) => {
          if (step <= maxStepReached) goToStep(step);
        }}
      />

      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-4 border-b border-slate-700">
        <div className="flex flex-wrap gap-2 items-center">
          <Link to="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <TemplatePicker />
          <ThemeColor />
        </div>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              variant="outline"
              className="border-slate-600"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {activeFormIndex < 6 && (
            <Button
              disabled={activeFormIndex <= 2 && !enabledNext}
              className="flex gap-2 bg-cyan-600 hover:bg-cyan-700"
              size="sm"
              onClick={goNext}
            >
              {activeFormIndex === 5 ? 'Finish' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {activeFormIndex === 1 ? (
        <PersonalDetail enabledNext={handleEnabledNext} />
      ) : activeFormIndex === 2 ? (
        <Summery enabledNext={handleEnabledNext} />
      ) : activeFormIndex === 3 ? (
        <Experience />
      ) : activeFormIndex === 4 ? (
        <Education />
      ) : activeFormIndex === 5 ? (
        <Skills />
      ) : activeFormIndex === 6 ? (
        <Navigate to={`/my-resume/${resumeId}/view`} />
      ) : null}

      {activeFormIndex <= 2 && !enabledNext && (
        <p className="text-xs text-amber-400/90 mt-4 text-center">
          Save this section to unlock Next
        </p>
      )}
    </div>
  );
}

export default FormSection;
