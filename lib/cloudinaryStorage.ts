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
  fileUrl?: string;
  publicId?: string;
  message?: string;
}

export interface ResumeFile {
  id: string;
  fileName: string;
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
  studentUSN: string
): Promise<UploadResult> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return {
        success: false,
        message: 'Cloudinary credentials not configured',
      };
    }

    // Generate unique public ID
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const publicId = `resumes/${studentUSN}/${studentUSN}_${timestamp}`;
    
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

    // Generate a direct download URL
    const url = cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true,
      flags: 'attachment', // Forces download instead of viewing
    });

    return url;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

// Get public URL for viewing
export function getPublicUrl(publicId: string): string {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary credentials not configured');
    }

    const url = cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true,
    });

    return url;
  } catch (error) {
    console.error('Error getting public URL:', error);
    throw new Error('Failed to get public URL');
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
      const fileName = resource.public_id.split('/').pop() || '';
      const downloadUrl = getDownloadUrl(resource.public_id);
      
      return {
        id: resource.public_id,
        fileName: fileName,
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
      const studentUSN = pathParts[1] || '';
      const fileName = pathParts[2] || '';
      const downloadUrl = getDownloadUrl(resource.public_id);
      
      return {
        id: resource.public_id,
        fileName: fileName,
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
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary credentials not configured');
      return false;
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
    });

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
