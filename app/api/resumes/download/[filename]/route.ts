import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
    
    // Try different possible public ID formats
    const possiblePublicIds = [
      `resumes/${studentUSN}/${studentUSN}_${timestamp}`,
      `resumes/${studentUSN}/resumes/${studentUSN}/${studentUSN}_${timestamp}`,
      `resumes/${studentUSN}/${filename}`,
      `resumes/${studentUSN}/resumes/${studentUSN}/${filename}`
    ];
    
    // Try to get the download URL for any of the possible public IDs
    for (const publicId of possiblePublicIds) {
      try {
        // Check if resource exists using the Cloudinary API
        try {
          const result = await cloudinary.api.resource(publicId, {
            resource_type: 'raw',
          });
          
          // Generate a temporary signed URL for secure download
          const signedUrl = cloudinary.url(publicId, {
            resource_type: 'raw',
            secure: true,
            sign_url: true,
            type: 'upload',
          });
          
          // Fetch using the signed URL
          const response = await fetch(signedUrl);
          
          if (response.ok) {
            const fileBuffer = await response.arrayBuffer();
            
            // Get file extension
            const fileExtension = filename.split('.').pop() || 'pdf';
            
            return new NextResponse(fileBuffer, {
              headers: {
                'Content-Type': `application/${fileExtension}`,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': fileBuffer.byteLength.toString(),
              },
            });
          }
        } catch (apiError) {
          // Resource not found, continue to next public ID
          continue;
        }
      } catch (error) {
        // Continue to next public ID
        continue;
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'File not found' 
    }, { status: 404 });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to download file' 
    });
  }
}