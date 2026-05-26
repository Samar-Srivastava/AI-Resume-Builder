export const DEFAULT_TEMPLATE_ID = 'classic';

export const RESUME_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Centered header with traditional sections',
    defaultColor: '#6366f1',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Colored sidebar with a clean content column',
    defaultColor: '#0891b2',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Single-column, ATS-friendly (recommended for job portals)',
    defaultColor: '#1f2937',
  },
];

export function getTemplate(templateId) {
  return (
    RESUME_TEMPLATES.find((t) => t.id === templateId) ??
    RESUME_TEMPLATES[0]
  );
}
