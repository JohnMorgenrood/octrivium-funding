import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get image metadata to detect format
    const metadata = await sharp(buffer).metadata();
    const hasAlpha = metadata.hasAlpha;
    
    // Compress and optimize image, preserving transparency
    let compressedBuffer: Buffer;
    let mimeType: string;
    
    if (hasAlpha) {
      // Use PNG for images with transparency
      compressedBuffer = await sharp(buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png({
          quality: 90,
          compressionLevel: 9,
        })
        .toBuffer();
      mimeType = 'image/png';
    } else {
      // Use JPEG for images without transparency
      compressedBuffer = await sharp(buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 85,
          progressive: true,
        })
        .toBuffer();
      mimeType = 'image/jpeg';
    }

    // Convert to base64
    const base64 = compressedBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      dataUrl,
      originalSize: buffer.length,
      compressedSize: compressedBuffer.length,
      compressionRatio: ((1 - compressedBuffer.length / buffer.length) * 100).toFixed(1),
    });
  } catch (error) {
    console.error('Image compression error:', error);
    return NextResponse.json({ error: 'Failed to compress image' }, { status: 500 });
  }
}
