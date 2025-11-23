// Color extraction and branding utilities

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  gradient?: {
    from: string;
    to: string;
  };
}

/**
 * Extract dominant colors from an image URL
 * This uses canvas API to analyze the logo
 */
export async function extractColorsFromLogo(imageUrl: string): Promise<BrandColors> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Collect all colors
      const colorMap = new Map<string, number>();
      
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        // Skip transparent and near-white/black pixels
        if (a < 50 || (r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) {
          continue;
        }
        
        const hex = rgbToHex(r, g, b);
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      }

      // Sort by frequency and get top 3 colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => color)
        .slice(0, 3);

      resolve({
        primary: sortedColors[0] || '#667eea',
        secondary: sortedColors[1] || '#764ba2',
        accent: sortedColors[2] || sortedColors[0] || '#667eea',
        gradient: {
          from: sortedColors[0] || '#667eea',
          to: sortedColors[1] || '#764ba2',
        },
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Generate complementary color
 */
export function getComplementaryColor(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Get complementary color
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;
  
  return rgbToHex(compR, compG, compB);
}

/**
 * Lighten or darken a color
 */
export function adjustColorBrightness(hex: string, percent: number): string {
  hex = hex.replace('#', '');
  
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const adjust = (color: number) => {
    const adjusted = Math.round(color + (255 - color) * (percent / 100));
    return Math.max(0, Math.min(255, adjusted));
  };
  
  return rgbToHex(adjust(r), adjust(g), adjust(b));
}

/**
 * Generate random brand colors
 */
export function generateRandomBrandColors(): BrandColors {
  const baseHue = Math.floor(Math.random() * 360);
  const complementaryHue = (baseHue + 180) % 360;
  
  return {
    primary: hslToHex(baseHue, 70, 55),
    secondary: hslToHex(complementaryHue, 70, 55),
    accent: hslToHex((baseHue + 90) % 360, 70, 55),
    gradient: {
      from: hslToHex(baseHue, 70, 55),
      to: hslToHex(baseHue + 30, 70, 65),
    },
  };
}

/**
 * Convert HSL to hex
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Popular preset color schemes
 */
export const PRESET_COLOR_SCHEMES = {
  professional: {
    primary: '#1e40af',
    secondary: '#0ea5e9',
    accent: '#06b6d4',
    gradient: { from: '#1e40af', to: '#0ea5e9' },
  },
  modern: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    gradient: { from: '#667eea', to: '#764ba2' },
  },
  elegant: {
    primary: '#1f2937',
    secondary: '#6b7280',
    accent: '#d1d5db',
    gradient: { from: '#1f2937', to: '#4b5563' },
  },
  vibrant: {
    primary: '#ec4899',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    gradient: { from: '#ec4899', to: '#8b5cf6' },
  },
  nature: {
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    gradient: { from: '#059669', to: '#10b981' },
  },
  sunset: {
    primary: '#f97316',
    secondary: '#fb923c',
    accent: '#fdba74',
    gradient: { from: '#f97316', to: '#fb923c' },
  },
};
