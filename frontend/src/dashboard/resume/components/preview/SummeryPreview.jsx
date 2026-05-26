import React from 'react'

function SummeryPreview({ resumeInfo, layout = 'classic' }) {
  if (!resumeInfo?.summery) return null;

  const isMinimal = layout === 'minimal';
  const accent = resumeInfo?.themeColor || '#6366f1';

  return (
    <div className={isMinimal ? 'my-5' : 'my-4'}>
      {isMinimal && (
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">
          Professional Summary
        </h3>
      )}
      <p className={`text-xs leading-relaxed ${isMinimal ? 'text-gray-800' : ''}`}>
        {resumeInfo.summery}
      </p>
      {!isMinimal && layout === 'modern' && (
        <hr className="my-4" style={{ borderColor: accent }} />
      )}
    </div>
  );
}

export default SummeryPreview
