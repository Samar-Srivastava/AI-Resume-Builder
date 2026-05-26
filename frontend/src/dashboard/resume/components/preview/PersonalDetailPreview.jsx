import React from 'react'

function PersonalDetailPreview({ resumeInfo, layout = 'classic' }) {
  const accent = resumeInfo?.themeColor || '#6366f1';
  const isModern = layout === 'modern';
  const isMinimal = layout === 'minimal';
  const textOnAccent = isModern ? '#ffffff' : accent;
  const align = isMinimal || layout === 'modern' ? 'text-left' : 'text-center';

  return (
    <div className={isMinimal ? 'border-b-2 border-gray-800 pb-4 mb-4' : ''}>
      <h2
        className={`font-bold ${isMinimal ? 'text-2xl uppercase tracking-wide' : 'text-xl'} ${align}`}
        style={{ color: isModern ? '#fff' : isMinimal ? '#111827' : accent }}
      >
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h2>
      <h2 className={`${align} text-sm font-medium mt-1`} style={{ color: isModern ? '#e2e8f0' : '#374151' }}>
        {resumeInfo?.jobTitle}
      </h2>
      {resumeInfo?.address && (
        <p className={`${align} font-normal text-xs mt-2`} style={{ color: isModern ? '#cbd5e1' : textOnAccent }}>
          {resumeInfo?.address}
        </p>
      )}
      <div className={`flex ${isMinimal || isModern ? 'flex-col gap-1' : 'justify-between'} mt-2 text-xs`}>
        {resumeInfo?.phone && (
          <span style={{ color: isModern ? '#e2e8f0' : isMinimal ? '#4b5563' : accent }}>
            {isMinimal ? `Phone: ${resumeInfo.phone}` : resumeInfo.phone}
          </span>
        )}
        {resumeInfo?.email && (
          <span style={{ color: isModern ? '#e2e8f0' : isMinimal ? '#4b5563' : accent }}>
            {isMinimal ? `Email: ${resumeInfo.email}` : resumeInfo.email}
          </span>
        )}
      </div>
      {!isMinimal && (
        <hr
          className="border-[1.5px] my-3"
          style={{ borderColor: isModern ? 'rgba(255,255,255,0.35)' : accent }}
        />
      )}
    </div>
  );
}

export default PersonalDetailPreview
