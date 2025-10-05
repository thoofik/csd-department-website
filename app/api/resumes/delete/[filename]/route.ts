import { NextRequest, NextResponse } from 'next/server';
import { deleteResume } from '../../../../../lib/firebaseStorage';

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
    
    // Construct file path
    const filePath = `resumes/${studentUSN}/${filename}`;
    
    try {
      const success = await deleteResume(filePath);
      
      if (success) {
        return NextResponse.json({ 
          success: true, 
          message: 'Resume deleted successfully' 
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to delete resume' 
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ 
        success: false, 
        message: `Failed to delete resume: ${error}` 
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
