'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Palette, Upload, RefreshCw } from 'lucide-react';
import { 
  extractColorsFromLogo, 
  generateRandomBrandColors, 
  PRESET_COLOR_SCHEMES,
  type BrandColors 
} from '@/lib/color-extractor';

interface BrandColorCustomizerProps {
  companyLogo?: string | null;
  currentColors?: {
    primary?: string | null;
    secondary?: string | null;
    accent?: string | null;
  };
  onSave?: (colors: BrandColors) => void;
}

export default function BrandColorCustomizer({ 
  companyLogo, 
  currentColors,
  onSave 
}: BrandColorCustomizerProps) {
  const { toast } = useToast();
  const [colors, setColors] = useState<BrandColors>({
    primary: currentColors?.primary || '#667eea',
    secondary: currentColors?.secondary || '#764ba2',
    accent: currentColors?.accent || '#667eea',
    gradient: {
      from: currentColors?.primary || '#667eea',
      to: currentColors?.secondary || '#764ba2',
    },
  });
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch current brand colors from database
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch('/api/user/brand-colors');
        if (response.ok) {
          const data = await response.json();
          if (data.brandColorPrimary) {
            setColors({
              primary: data.brandColorPrimary,
              secondary: data.brandColorSecondary || '#764ba2',
              accent: data.brandColorAccent || '#667eea',
              gradient: {
                from: data.brandColorPrimary,
                to: data.brandColorSecondary || '#764ba2',
              },
            });
          }
        }
      } catch (error) {
        console.error('Error fetching colors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  const handleExtractFromLogo = async () => {
    if (!companyLogo) {
      toast({
        title: 'No logo found',
        description: 'Please upload a company logo first in Settings.',
        variant: 'destructive',
      });
      return;
    }

    setExtracting(true);
    try {
      const extractedColors = await extractColorsFromLogo(companyLogo);
      setColors(extractedColors);
      toast({
        title: 'Colors extracted!',
        description: 'Brand colors have been extracted from your logo.',
      });
    } catch (error) {
      console.error('Error extracting colors:', error);
      toast({
        title: 'Extraction failed',
        description: 'Could not extract colors from logo. Try selecting colors manually.',
        variant: 'destructive',
      });
    } finally {
      setExtracting(false);
    }
  };

  const handleGenerateRandom = () => {
    const randomColors = generateRandomBrandColors();
    setColors(randomColors);
    toast({
      title: 'Random colors generated!',
      description: 'Try them out or generate again.',
    });
  };

  const handleApplyPreset = (presetName: string) => {
    const preset = PRESET_COLOR_SCHEMES[presetName as keyof typeof PRESET_COLOR_SCHEMES];
    setColors(preset);
    toast({
      title: `${presetName.charAt(0).toUpperCase() + presetName.slice(1)} theme applied!`,
      description: 'Preview the colors below.',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/brand-colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
        }),
      });

      if (!response.ok) throw new Error('Failed to save colors');

      toast({
        title: 'Brand colors saved!',
        description: 'Your new colors will be applied to all invoices.',
      });

      onSave?.(colors);
    } catch (error) {
      console.error('Error saving colors:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save brand colors. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Brand Color Customizer
        </CardTitle>
        <CardDescription>
          Automatically extract colors from your logo or choose from presets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={handleExtractFromLogo}
            disabled={extracting || !companyLogo}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {extracting ? 'Extracting...' : 'Extract from Logo'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGenerateRandom}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Random Colors
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Colors'}
          </Button>
        </div>

        {/* Color Preview */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Current Colors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Primary</label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-200" 
                  style={{ backgroundColor: colors.primary }}
                />
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                  className="h-12 w-full cursor-pointer"
                />
              </div>
              <p className="text-xs font-mono text-gray-500">{colors.primary}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-600">Secondary</label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-200" 
                  style={{ backgroundColor: colors.secondary }}
                />
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                  className="h-12 w-full cursor-pointer"
                />
              </div>
              <p className="text-xs font-mono text-gray-500">{colors.secondary}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-600">Accent</label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-200" 
                  style={{ backgroundColor: colors.accent }}
                />
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                  className="h-12 w-full cursor-pointer"
                />
              </div>
              <p className="text-xs font-mono text-gray-500">{colors.accent}</p>
            </div>
          </div>

          {/* Gradient Preview */}
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Gradient Preview</label>
            <div 
              className="h-20 rounded-lg" 
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
              }}
            />
          </div>
        </div>

        {/* Preset Themes */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Preset Themes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(PRESET_COLOR_SCHEMES).map(([name, scheme]) => (
              <button
                key={name}
                onClick={() => handleApplyPreset(name)}
                className="group relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all p-3 text-left"
              >
                <div 
                  className="h-12 rounded mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${scheme.gradient.from} 0%, ${scheme.gradient.to} 100%)`
                  }}
                />
                <p className="text-xs font-medium capitalize">{name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">How it will look on invoices</h3>
          <div className="border rounded-lg p-6">
            <div 
              className="rounded-t-lg p-6 text-white"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
              }}
            >
              <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
              <p className="text-sm opacity-90">INV-2025-001</p>
            </div>
            <div className="p-6 bg-gray-50">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="px-4 py-2 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: colors.accent }}
                >
                  Pay Now
                </div>
                <div 
                  className="px-4 py-2 rounded text-white text-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  Download PDF
                </div>
              </div>
              <p className="text-xs text-gray-600">Your brand colors will be applied throughout the invoice</p>
            </div>
          </div>
        </div>
        </>
        )}
      </CardContent>
    </Card>
  );
}
