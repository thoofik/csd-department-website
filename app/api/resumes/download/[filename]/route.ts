import { NextRequest, NextResponse } from 'next/server';
import { getDownloadUrl } from '../../../../../lib/cloudinaryStorage';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    if (!filename) {
      return NextResponse.json({ 
        success: false, 
        message: 'Filename is required' 
      });
    }

    // Extract student USN from filename (format: USN_timestamp.extension)
    const parts = filename.split('_');
    if (parts.length < 2) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid filename format' 
      });
    }

    const studentUSN = parts[0];
    const timestamp = parts[1].split('.')[0];
    const publicId = `resumes/${studentUSN}/${studentUSN}_${timestamp}`;
    
    try {
      const downloadUrl = getDownloadUrl(publicId);
      
      // Redirect to the download URL
      return NextResponse.redirect(downloadUrl);

    } catch (fileError) {
      return NextResponse.json({ 
        success: false, 
        message: 'File not found in Cloudinary storage' 
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to download file' 
    });
  }
}
