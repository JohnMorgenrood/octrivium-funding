'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool, RotateCcw } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureData: string, signerName: string) => void;
  disabled?: boolean;
}

export default function SignaturePad({ onSave, disabled = false }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [signerName, setSignerName] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (sigCanvas.current && !isEmpty && signerName.trim()) {
      const dataURL = sigCanvas.current.toDataURL();
      onSave(dataURL, signerName);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          Digital Signature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Your Name *</Label>
          <Input
            placeholder="Enter your full name"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Sign Below *</Label>
          <div className="border-2 border-dashed rounded-lg overflow-hidden bg-white">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: 'w-full h-40 sm:h-48 cursor-crosshair',
              }}
              onEnd={() => setIsEmpty(false)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={clear}
            disabled={disabled}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button
            type="button"
            onClick={save}
            disabled={disabled || isEmpty || !signerName.trim()}
            className="flex-1"
          >
            Save Signature
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          By signing, you agree to the terms and conditions of this invoice
        </p>
      </CardContent>
    </Card>
  );
}
