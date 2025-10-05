import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../../lib/cloudinaryStorage';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const studentName: string = data.get('studentName') as string;
    const studentEmail: string = data.get('studentEmail') as string;
    const studentUSN: string = data.get('studentUSN') as string;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' });
    }

    if (!studentName || !studentEmail || !studentUSN) {
      return NextResponse.json({ 
        success: false, 
        message: 'Student information is required' 
      });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Only PDF and Word documents are allowed' 
      });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        message: 'File size must be less than 5MB' 
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename for storage (with USN prefix for organization)
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const storageFileName = `${studentUSN}_${timestamp}.${fileExtension}`;

    // Upload to Cloudinary Storage
    const uploadResult = await uploadToCloudinary(buffer, storageFileName, file.type, studentUSN, file.name);

    if (!uploadResult.success) {
      return NextResponse.json({ 
        success: false, 
        message: uploadResult.message || 'Failed to upload to Cloudinary storage' 
      });
    }

    // Store file metadata
    const fileMetadata = {
      id: uploadResult.publicId || `${studentUSN}_${timestamp}`,
      originalName: file.name,
      fileName: uploadResult.originalFileName || file.name, // Use original filename for display
      studentName: studentName,
      studentEmail: studentEmail,
      studentUSN: studentUSN,
      uploadDate: new Date().toISOString(),
      fileSize: file.size,
      fileType: file.type,
      filePath: uploadResult.fileUrl || '',
      downloadUrl: uploadResult.fileUrl || '',
      publicId: uploadResult.publicId || ''
    };

    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully to Cloudinary storage',
      file: fileMetadata
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to upload file' 
    });
  }
}
