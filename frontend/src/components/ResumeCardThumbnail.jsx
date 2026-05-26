import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { getTemplate } from '@/lib/resumeTemplates';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import React from 'react';

/**
 * Mini live preview for dashboard cards (scaled document).
 */
export default function ResumeCardThumbnail({ resume }) {
  const attrs = resume?.attributes ?? resume;
  const resumeInfo = {
    ...attrs,
    templateId: attrs?.templateId || 'classic',
  };
  const template = getTemplate(resumeInfo.templateId);
  const accent = resumeInfo.themeColor || template.defaultColor;

  return (
    <div
      className="relative w-full h-[200px] bg-white rounded-md overflow-hidden shadow-inner border border-slate-600/50"
      style={{ borderTopColor: accent, borderTopWidth: 4 }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left pointer-events-none"
        style={{
          transform: 'scale(0.22)',
          width: '455%',
          minHeight: '900px',
        }}
      >
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo: () => {} }}>
          <ResumePreview />
        </ResumeInfoContext.Provider>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900/80 to-transparent" />
    </div>
  );
}
