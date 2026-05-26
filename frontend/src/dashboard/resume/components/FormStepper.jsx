import { Check } from 'lucide-react';
import React from 'react';

const STEPS = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Summary' },
  { id: 3, label: 'Experience' },
  { id: 4, label: 'Education' },
  { id: 5, label: 'Skills' },
];

export default function FormStepper({ activeStep, onStepClick, maxReachable = 5 }) {
  const progress = ((activeStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="flex justify-between gap-1">
        {STEPS.map((step) => {
          const done = step.id < activeStep;
          const active = step.id === activeStep;
          const clickable = step.id <= maxReachable && onStepClick;

          return (
            <li key={step.id} className="flex-1 flex flex-col items-center min-w-0">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(step.id)}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  active
                    ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/30'
                    : done
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                } ${clickable && !active ? 'hover:bg-slate-600 cursor-pointer' : 'cursor-default'}`}
              >
                {done ? <Check className="h-4 w-4" /> : step.id}
              </button>
              <span
                className={`mt-2 text-[10px] sm:text-xs font-medium truncate max-w-full text-center ${
                  active ? 'text-cyan-400' : done ? 'text-emerald-400/90' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
