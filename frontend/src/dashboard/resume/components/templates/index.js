import ClassicLayout from './ClassicLayout';
import ModernLayout from './ModernLayout';
import MinimalLayout from './MinimalLayout';
import { DEFAULT_TEMPLATE_ID } from '@/lib/resumeTemplates';

const LAYOUTS = {
  classic: ClassicLayout,
  modern: ModernLayout,
  minimal: MinimalLayout,
};

export function getResumeLayout(templateId) {
  return LAYOUTS[templateId] ?? LAYOUTS[DEFAULT_TEMPLATE_ID];
}
