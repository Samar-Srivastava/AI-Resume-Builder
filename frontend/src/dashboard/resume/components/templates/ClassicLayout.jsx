import PersonalDetailPreview from '../preview/PersonalDetailPreview';
import SummeryPreview from '../preview/SummeryPreview';
import ExperiencePreview from '../preview/ExperiencePreview';
import EducationalPreview from '../preview/EducationalPreview';
import SkillsPreview from '../preview/SkillsPreview';

export default function ClassicLayout({ resumeInfo }) {
  const accent = resumeInfo?.themeColor || '#6366f1';

  return (
    <div
      className="shadow-lg h-full p-14 border-t-[20px] text-black bg-white"
      style={{ borderColor: accent }}
    >
      <PersonalDetailPreview resumeInfo={resumeInfo} layout="classic" />
      <SummeryPreview resumeInfo={resumeInfo} layout="classic" />
      <ExperiencePreview resumeInfo={resumeInfo} layout="classic" />
      <EducationalPreview resumeInfo={resumeInfo} layout="classic" />
      <SkillsPreview resumeInfo={resumeInfo} layout="classic" />
    </div>
  );
}
