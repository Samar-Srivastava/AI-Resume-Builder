import React from 'react'
import { sanitizeHtml } from '@/lib/sanitizeHtml'

function SectionHeading({ title, layout, accent }) {
  const align = layout === 'classic' ? 'text-center' : 'text-left';
  if (layout === 'minimal') {
    return (
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-3">
        {title}
      </h3>
    );
  }
  return (
    <>
      <h2 className={`font-bold text-sm mb-2 ${align}`} style={{ color: accent }}>
        {title}
      </h2>
      <hr className="mb-3" style={{ borderColor: accent }} />
    </>
  );
}

function ExperiencePreview({ resumeInfo, layout = 'classic' }) {
  const accent = resumeInfo?.themeColor || '#6366f1';
  if (!resumeInfo?.Experience?.length) return null;

  return (
    <div className="my-6">
      <SectionHeading title="Professional Experience" layout={layout} accent={accent} />
      {resumeInfo.Experience.map((experience, index) => (
        <div key={index} className="my-4">
          <h2
            className="text-sm font-bold"
            style={{ color: layout === 'minimal' ? '#111827' : accent }}
          >
            {experience?.title}
          </h2>
          <h2 className="text-xs flex flex-wrap justify-between gap-1 text-gray-700">
            <span>
              {experience?.companyName}
              {experience?.city ? `, ${experience.city}` : ''}
              {experience?.state ? `, ${experience.state}` : ''}
            </span>
            <span>
              {experience?.startDate} –{' '}
              {experience?.currentlyWorking ? 'Present' : experience?.endDate}
            </span>
          </h2>
          <div
            className="text-xs my-2 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(experience?.workSummery),
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview
