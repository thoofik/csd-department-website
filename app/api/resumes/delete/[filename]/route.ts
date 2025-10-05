import { NextRequest, NextResponse } from 'next/server';
import { deleteResume } from '../../../../../lib/cloudinaryStorage';

export async function DELETE(
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
    
    // Try different possible public ID formats
    const possiblePublicIds = [
      `resumes/${studentUSN}/${studentUSN}_${timestamp}`,
      `resumes/${studentUSN}/resumes/${studentUSN}/${studentUSN}_${timestamp}`,
      `resumes/${studentUSN}/${filename}`,
      `resumes/${studentUSN}/resumes/${studentUSN}/${filename}` // Add nested folder with extension
    ];
    
    let deleteSuccess = false;
    let lastError = '';
    
    for (const publicId of possiblePublicIds) {
      try {
        const success = await deleteResume(publicId);
        if (success) {
          deleteSuccess = true;
          break;
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        continue;
      }
    }
    
    if (deleteSuccess) {
      return NextResponse.json({ 
        success: true, 
        message: 'Resume deleted successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `Failed to delete resume: ${lastError}` 
      });
    }

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete file' 
    });
  }
}
