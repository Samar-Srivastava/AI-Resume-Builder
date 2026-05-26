import PersonalDetailPreview from '../preview/PersonalDetailPreview';
import SummeryPreview from '../preview/SummeryPreview';
import ExperiencePreview from '../preview/ExperiencePreview';
import EducationalPreview from '../preview/EducationalPreview';
import SkillsPreview from '../preview/SkillsPreview';

export default function MinimalLayout({ resumeInfo }) {
  const accent = resumeInfo?.themeColor || '#1f2937';

  return (
    <div
      className="shadow-lg h-full p-12 text-black bg-white font-serif"
      style={{ color: '#111827' }}
    >
      <PersonalDetailPreview resumeInfo={resumeInfo} layout="minimal" />
      <SummeryPreview resumeInfo={resumeInfo} layout="minimal" />
      <ExperiencePreview resumeInfo={resumeInfo} layout="minimal" />
      <EducationalPreview resumeInfo={resumeInfo} layout="minimal" />
      <SkillsPreview resumeInfo={resumeInfo} layout="minimal" accent={accent} />
    </div>
  );
}
