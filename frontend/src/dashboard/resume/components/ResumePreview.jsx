import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { DEFAULT_TEMPLATE_ID } from '@/lib/resumeTemplates';
import React, { useContext } from 'react';
import { getResumeLayout } from './templates';

function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const templateId = resumeInfo?.templateId || DEFAULT_TEMPLATE_ID;
  const Layout = getResumeLayout(templateId);

  return <Layout resumeInfo={resumeInfo} />;
}

export default ResumePreview;
