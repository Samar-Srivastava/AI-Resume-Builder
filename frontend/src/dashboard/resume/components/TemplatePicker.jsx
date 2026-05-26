import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { DEFAULT_TEMPLATE_ID, RESUME_TEMPLATES, getTemplate } from '@/lib/resumeTemplates';
import { Check, LayoutTemplate } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import GlobalApi from './../../../../service/GlobalApi';
import { toast } from 'sonner';

function TemplateThumbnail({ template, selected }) {
  const accent = template.defaultColor;
  return (
    <div
      className={`relative rounded-lg border-2 p-2 h-24 bg-white overflow-hidden transition-all ${
        selected ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-slate-600'
      }`}
    >
      {template.id === 'classic' && (
        <div className="h-full flex flex-col items-center justify-center gap-0.5">
          <div className="w-8 h-1 rounded" style={{ background: accent }} />
          <div className="w-10 h-0.5 bg-gray-300 rounded" />
          <div className="w-full h-0.5 bg-gray-200 rounded mt-1" />
          <div className="w-full h-0.5 bg-gray-200 rounded" />
        </div>
      )}
      {template.id === 'modern' && (
        <div className="h-full flex gap-1">
          <div className="w-1/3 rounded-sm" style={{ background: accent }} />
          <div className="flex-1 flex flex-col gap-0.5 justify-center">
            <div className="w-full h-0.5 bg-gray-200 rounded" />
            <div className="w-full h-0.5 bg-gray-200 rounded" />
            <div className="w-3/4 h-0.5 bg-gray-200 rounded" />
          </div>
        </div>
      )}
      {template.id === 'minimal' && (
        <div className="h-full flex flex-col justify-start gap-0.5 pt-1">
          <div className="w-10 h-1 bg-gray-800 rounded" />
          <div className="w-full h-0.5 bg-gray-300 rounded mt-1" />
          <div className="w-full h-0.5 bg-gray-200 rounded" />
          <div className="w-full h-0.5 bg-gray-200 rounded" />
        </div>
      )}
      {selected && (
        <span className="absolute top-1 right-1 bg-cyan-500 rounded-full p-0.5">
          <Check className="h-3 w-3 text-white" />
        </span>
      )}
    </div>
  );
}

/** Inline grid for create dialog */
export function TemplatePickerGrid({ value, onChange, disabled }) {
  return (
    <div className="grid grid-cols-3 gap-3 my-4">
      {RESUME_TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(template.id)}
          className="text-left rounded-lg p-2 bg-slate-700/50 hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <TemplateThumbnail template={template} selected={value === template.id} />
          <p className="text-sm font-semibold text-white mt-2">{template.name}</p>
          <p className="text-xs text-slate-400 line-clamp-2">{template.description}</p>
        </button>
      ))}
    </div>
  );
}

/** Popover for editor toolbar */
export default function TemplatePicker() {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const currentId = resumeInfo?.templateId || DEFAULT_TEMPLATE_ID;
  const [saving, setSaving] = useState(false);

  const onSelect = async (templateId) => {
    const template = getTemplate(templateId);
    setResumeInfo({
      ...resumeInfo,
      templateId,
      themeColor: resumeInfo?.themeColor || template.defaultColor,
    });

    if (!resumeId) return;

    setSaving(true);
    try {
      await GlobalApi.UpdateResumeDetail(resumeId, {
        data: {
          templateId,
          themeColor: resumeInfo?.themeColor || template.defaultColor,
        },
      });
      toast.success(`Template: ${template.name}`);
    } catch {
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2" disabled={saving}>
          <LayoutTemplate className="h-4 w-4" />
          Template
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-slate-800 border-slate-700 text-gray-200">
        <h2 className="text-sm font-bold text-white mb-3">Resume template</h2>
        <div className="grid grid-cols-1 gap-2">
          {RESUME_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className="flex gap-3 items-center p-2 rounded-lg hover:bg-slate-700 text-left"
            >
              <div className="w-20 shrink-0">
                <TemplateThumbnail
                  template={template}
                  selected={currentId === template.id}
                />
              </div>
              <div>
                <p className="font-semibold text-white">{template.name}</p>
                <p className="text-xs text-slate-400">{template.description}</p>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
