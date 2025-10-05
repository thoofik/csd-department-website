import { NextRequest, NextResponse } from 'next/server';
import { deleteResume } from '../../../../../lib/cloudinaryStorage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    console.log('Delete request for filename:', filename);
    
    if (!filename) {
      return NextResponse.json({ 
        success: false, 
        message: 'Filename is required' 
      });
    }

    // Extract student USN from filename (format: USN_timestamp.extension)
    const parts = filename.split('_');
    if (parts.length < 2) {
      console.log('Invalid filename format:', filename);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid filename format' 
      });
    }

    const studentUSN = parts[0];
    const timestamp = parts[1].split('.')[0];
    console.log('Extracted studentUSN:', studentUSN, 'timestamp:', timestamp);
    
    // Try different possible public ID formats
    const possiblePublicIds = [
      `resumes/${studentUSN}/${studentUSN}_${timestamp}`,
      `resumes/${studentUSN}/resumes/${studentUSN}/${studentUSN}_${timestamp}`,
      `resumes/${studentUSN}/${filename}`,
      `resumes/${studentUSN}/resumes/${studentUSN}/${filename}` // Add nested folder with extension
    ];
    
    console.log('Trying to delete with public IDs:', possiblePublicIds);
    
    let deleteSuccess = false;
    let lastError = '';
    
    for (const publicId of possiblePublicIds) {
      try {
        console.log('Attempting delete for:', publicId);
        const success = await deleteResume(publicId);
        console.log('Delete result for', publicId, ':', success);
        if (success) {
          deleteSuccess = true;
          console.log('Delete successful for:', publicId);
          break;
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.log('Delete error for', publicId, ':', error);
        continue;
      }
    }
    
    if (deleteSuccess) {
      console.log('Delete operation completed successfully');
      return NextResponse.json({ 
        success: true, 
        message: 'Resume deleted successfully' 
      });
    } else {
      console.log('Delete operation failed:', lastError);
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
