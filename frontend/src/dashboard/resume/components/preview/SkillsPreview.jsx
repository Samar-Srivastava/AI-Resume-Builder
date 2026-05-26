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

function SkillsPreview({ resumeInfo, layout = 'classic', accent: accentProp }) {
  const accent = accentProp || resumeInfo?.themeColor || '#6366f1';
  if (!resumeInfo?.skills?.length) return null;

  if (layout === 'minimal') {
    return (
      <div className="my-6">
        <SectionHeading title="Skills" layout={layout} accent={accent} />
        <p className="text-xs text-gray-800 leading-relaxed">
          {resumeInfo.skills.map((s) => s.name).filter(Boolean).join(' • ')}
        </p>
      </div>
    );
  }

  return (
    <div className="my-6">
      <SectionHeading title="Skills" layout={layout} accent={accent} />
      <div className={`grid gap-3 my-4 ${layout === 'modern' ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {resumeInfo.skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <h2 className="text-xs shrink-0">{skill.name}</h2>
            <div className="h-2 bg-gray-200 flex-1 max-w-[140px]">
              <div
                className="h-2"
                style={{
                  backgroundColor: accent,
                  width: `${(skill?.rating || 0) * 20}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsPreview
