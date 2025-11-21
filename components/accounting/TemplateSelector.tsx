'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check } from 'lucide-react';
import { INVOICE_TEMPLATES } from './invoice-templates';
import {
  Template1Classic,
  Template2Modern,
  Template3Minimal,
  Template4Bold,
  Template5Corporate,
  Template6Creative,
  Template7Elegant,
  Template8Tech,
  Template9Luxury,
  Template10Playful,
} from './invoice-templates';

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (templateId: number) => void;
  currentTemplate: number;
  invoice: any;
  user: any;
  customer: any;
  items: any[];
}

const TEMPLATE_COMPONENTS: any = {
  Template1Classic,
  Template2Modern,
  Template3Minimal,
  Template4Bold,
  Template5Corporate,
  Template6Creative,
  Template7Elegant,
  Template8Tech,
  Template9Luxury,
  Template10Playful,
};

export default function TemplateSelector({
  open,
  onClose,
  onSelect,
  currentTemplate,
  invoice,
  user,
  customer,
  items,
}: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);

  const handleSelect = () => {
    onSelect(selectedTemplate);
    onClose();
  };

  if (previewTemplate) {
    const template = INVOICE_TEMPLATES.find(t => t.id === previewTemplate);
    if (template) {
      const TemplateComponent = TEMPLATE_COMPONENTS[template.component];
      return (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{template.name} - Preview</DialogTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                    Back to Templates
                  </Button>
                  <Button onClick={() => {
                    setSelectedTemplate(previewTemplate);
                    handleSelect();
                  }}>
                    Use This Template
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <div className="mt-4 border rounded-lg overflow-hidden">
              <TemplateComponent
                invoice={invoice}
                user={user}
                customer={customer}
                items={items}
              />
            </div>
          </DialogContent>
        </Dialog>
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Choose Invoice Template</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="grid grid-cols-2 gap-4 mt-4">
            {INVOICE_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                
                <div className="mb-3">
                  <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>

                {/* Template Preview Thumbnail */}
                <div className="bg-gray-100 rounded border border-gray-300 h-48 flex items-center justify-center mb-3 overflow-hidden">
                  <div className="transform scale-[0.15] origin-top-left w-[800px]">
                    {(() => {
                      const TemplateComponent = TEMPLATE_COMPONENTS[template.component];
                      return (
                        <TemplateComponent
                          invoice={invoice}
                          user={user}
                          customer={customer}
                          items={items.slice(0, 2)}
                        />
                      );
                    })()}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template.id);
                  }}
                >
                  Full Preview
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect}>
            Select Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
