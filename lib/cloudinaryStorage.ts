import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export interface UploadResult {
  success: boolean;
  fileName?: string;
  originalFileName?: string;
  fileUrl?: string;
  publicId?: string;
  message?: string;
}

export interface ResumeFile {
  id: string;
  fileName: string; // Original filename for display
  storageFileName: string; // Storage filename for API operations
  studentUSN: string;
  uploadDate: string;
  fileSize: number;
  filePath: string;
  downloadUrl: string;
  publicId: string;
}

// Upload file to Cloudinary
export async function uploadToCloudinary(
  file: Buffer,
  fileName: string,
  contentType: string,
  studentUSN: string,
  originalFileName: string
): Promise<UploadResult> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return {
        success: false,
        message: 'Cloudinary credentials not configured',
      };
    }

    // Generate unique public ID with file extension
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const publicId = `resumes/${studentUSN}/${studentUSN}_${timestamp}.${fileExtension}`;
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // For PDFs and documents
          public_id: publicId,
          folder: `resumes/${studentUSN}`,
          use_filename: false,
          unique_filename: true,
          overwrite: false,
          context: `original_filename=${originalFileName}|student_usn=${studentUSN}`,
          access_mode: 'public', // Make files publicly accessible
          type: 'upload', // Ensure it's an upload type
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(file);
    });

    const uploadResult = result as any;

    return {
      success: true,
      fileName: fileName,
      originalFileName: originalFileName,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      message: 'File uploaded successfully to Cloudinary',
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      message: `Failed to upload file to Cloudinary: ${error}`,
    };
  }
}

// Get download URL from Cloudinary
export function getDownloadUrl(publicId: string): string {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary credentials not configured');
    }

    // Generate a direct download URL without authentication
    const url = cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true,
      flags: 'attachment', // Forces download instead of viewing
      sign_url: false, // Don't sign the URL to make it publicly accessible
    });

    return url;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}


// List all resumes for a specific student
export async function listStudentResumes(studentUSN: string): Promise<ResumeFile[]> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary credentials not configured');
      return [];
    }

    const result = await cloudinary.search
      .expression(`folder:resumes/${studentUSN}`)
      .with_field('context')
      .max_results(100)
      .execute();

    const resumes: ResumeFile[] = result.resources.map((resource: any) => {
      // Extract original filename from context, fallback to public_id
      let fileName = '';
      if (resource.context && resource.context.original_filename) {
        fileName = resource.context.original_filename;
      } else {
        fileName = resource.public_id.split('/').pop() || '';
      }
      
      // Extract storage filename from public_id
      const storageFileName = resource.public_id.split('/').pop() || '';
      const downloadUrl = getDownloadUrl(resource.public_id);
      
      return {
        id: resource.public_id,
        fileName: fileName,
        storageFileName: storageFileName,
        studentUSN: studentUSN,
        uploadDate: resource.created_at,
        fileSize: resource.bytes,
        filePath: resource.public_id,
        downloadUrl: downloadUrl,
        publicId: resource.public_id,
      };
    });

    return resumes;
  } catch (error) {
    console.error('Error listing student resumes:', error);
    return [];
  }
}

// List all resumes (for admin purposes)
export async function listAllResumes(): Promise<ResumeFile[]> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary credentials not configured');
      return [];
    }

    const result = await cloudinary.search
      .expression('folder:resumes/*')
      .with_field('context')
      .max_results(1000)
      .execute();

    const resumes: ResumeFile[] = result.resources.map((resource: any) => {
      const pathParts = resource.public_id.split('/');
      
      // Extract student USN from path
      let studentUSN = '';
      if (pathParts.length >= 3) {
        studentUSN = pathParts[1] || '';
      }
      
      // Extract original filename from context, fallback to public_id
      let fileName = '';
      if (resource.context && resource.context.original_filename) {
        fileName = resource.context.original_filename;
      } else {
        fileName = resource.public_id.split('/').pop() || '';
      }
      
      // Extract storage filename from public_id
      const storageFileName = resource.public_id.split('/').pop() || '';
      const downloadUrl = getDownloadUrl(resource.public_id);
      
      return {
        id: resource.public_id,
        fileName: fileName,
        storageFileName: storageFileName,
        studentUSN: studentUSN,
        uploadDate: resource.created_at,
        fileSize: resource.bytes,
        filePath: resource.public_id,
        downloadUrl: downloadUrl,
        publicId: resource.public_id,
      };
    });

    return resumes;
  } catch (error) {
    console.error('Error listing all resumes:', error);
    return [];
  }
}

// Delete resume from Cloudinary
export async function deleteResume(publicId: string): Promise<boolean> {
  try {
    console.log('deleteResume called with publicId:', publicId);
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary credentials not configured');
      console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
      console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');
      console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');
      return false;
    }

    console.log('Attempting to delete from Cloudinary:', publicId);
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
    });

    console.log('Cloudinary delete result:', result);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
}

// Check if Cloudinary is properly configured
export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}
