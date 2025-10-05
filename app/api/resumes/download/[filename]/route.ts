import { NextRequest, NextResponse } from 'next/server';
import { getSignedDownloadUrl } from '../../../../../lib/googleCloudStorage';

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
    
    // Construct file path
    const filePath = `resumes/${studentUSN}/${filename}`;
    
    try {
      // Generate signed URL for secure download
      const signedUrl = await getSignedDownloadUrl(filePath);
      
      // Redirect to the signed URL
      return NextResponse.redirect(signedUrl);
      
    } catch (error) {
      console.error('Error generating download URL:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'File not found or access denied' 
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
