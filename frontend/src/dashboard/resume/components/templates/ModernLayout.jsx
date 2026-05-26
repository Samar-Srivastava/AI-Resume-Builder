import PersonalDetailPreview from '../preview/PersonalDetailPreview';
import SummeryPreview from '../preview/SummeryPreview';
import ExperiencePreview from '../preview/ExperiencePreview';
import EducationalPreview from '../preview/EducationalPreview';
import SkillsPreview from '../preview/SkillsPreview';

export default function ModernLayout({ resumeInfo }) {
  const accent = resumeInfo?.themeColor || '#0891b2';

  return (
    <div className="shadow-lg h-full min-h-[700px] flex text-black bg-white overflow-hidden">
      <aside
        className="w-[32%] shrink-0 p-8 text-white"
        style={{ backgroundColor: accent }}
      >
        <PersonalDetailPreview resumeInfo={resumeInfo} layout="modern" />
      </aside>
      <main className="flex-1 p-10">
        <SummeryPreview resumeInfo={resumeInfo} layout="modern" />
        <ExperiencePreview resumeInfo={resumeInfo} layout="modern" />
        <EducationalPreview resumeInfo={resumeInfo} layout="modern" />
        <SkillsPreview resumeInfo={resumeInfo} layout="modern" />
      </main>
    </div>
  );
}
