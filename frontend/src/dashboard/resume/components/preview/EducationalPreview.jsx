import React from 'react'

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

function EducationalPreview({ resumeInfo, layout = 'classic' }) {
  const accent = resumeInfo?.themeColor || '#6366f1';
  if (!resumeInfo?.education?.length) return null;

  return (
    <div className="my-6">
      <SectionHeading title="Education" layout={layout} accent={accent} />
      {resumeInfo.education.map((education, index) => (
        <div key={index} className="my-4">
          <h2
            className="text-sm font-bold"
            style={{ color: layout === 'minimal' ? '#111827' : accent }}
          >
            {education?.universityName}
          </h2>
          <h2 className="text-xs flex flex-wrap justify-between gap-1 text-gray-700">
            <span>
              {education?.degree} in {education?.major}
            </span>
            <span>
              {education?.startDate} – {education?.endDate}
            </span>
          </h2>
          {education?.description && (
            <p className="text-xs my-2 text-gray-700">{education.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default EducationalPreview
