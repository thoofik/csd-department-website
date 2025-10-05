import { Storage } from '@google-cloud/storage';
import { Buffer } from 'buffer';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Path to service account key file
  // Alternative: use credentials from environment variables
  credentials: process.env.GOOGLE_CLOUD_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS) : undefined,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || 'csd-resumes';

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

// Upload file to Google Cloud Storage
export async function uploadToGoogleCloudStorage(
  file: Buffer,
  fileName: string,
  contentType: string,
  studentUSN: string,
  originalFileName: string
): Promise<UploadResult> {
  try {
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_CLOUD_BUCKET_NAME) {
      return {
        success: false,
        message: 'Google Cloud Storage credentials not configured',
      };
    }

    // Generate unique filename for storage
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const storageFileName = `${studentUSN}_${timestamp}.${fileExtension}`;
    const filePath = `resumes/${studentUSN}/${storageFileName}`;

    const bucket = storage.bucket(bucketName);
    const fileUpload = bucket.file(filePath);

    // Upload file
    await fileUpload.save(file, {
      metadata: {
        contentType: contentType,
        metadata: {
          originalFileName: originalFileName,
          studentUSN: studentUSN,
          uploadDate: new Date().toISOString(),
        },
      },
    });

    // Make file publicly accessible (optional - you can control access differently)
    await fileUpload.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;

    return {
      success: true,
      fileName: fileName,
      originalFileName: originalFileName,
      fileUrl: publicUrl,
      publicId: filePath,
      message: 'File uploaded successfully to Google Cloud Storage',
    };
  } catch (error) {
    console.error('Google Cloud Storage upload error:', error);
    return {
      success: false,
      message: `Failed to upload file to Google Cloud Storage: ${error}`,
    };
  }
}

// Get download URL from Google Cloud Storage
export function getDownloadUrl(filePath: string): string {
  try {
    if (!process.env.GOOGLE_CLOUD_BUCKET_NAME) {
      throw new Error('Google Cloud Storage bucket not configured');
    }

    // Generate a signed URL for secure download (expires in 1 hour)
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    // For public files, return direct URL
    return `https://storage.googleapis.com/${bucketName}/${filePath}`;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

// Generate signed URL for private access
export async function getSignedDownloadUrl(filePath: string): Promise<string> {
  try {
    if (!process.env.GOOGLE_CLOUD_BUCKET_NAME) {
      throw new Error('Google Cloud Storage bucket not configured');
    }

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    // Generate signed URL (expires in 1 hour)
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
}

// List all resumes for a specific student
export async function listStudentResumes(studentUSN: string): Promise<ResumeFile[]> {
  try {
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_CLOUD_BUCKET_NAME) {
      console.warn('Google Cloud Storage credentials not configured');
      return [];
    }

    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({
      prefix: `resumes/${studentUSN}/`,
    });

    const resumes: ResumeFile[] = files.map((file) => {
      const metadata = file.metadata;
      const fileName = metadata.metadata?.originalFileName || file.name.split('/').pop() || '';
      const storageFileName = file.name.split('/').pop() || '';
      const downloadUrl = getDownloadUrl(file.name);

      return {
        id: file.name,
        fileName: fileName,
        storageFileName: storageFileName,
        studentUSN: studentUSN,
        uploadDate: metadata.timeCreated || new Date().toISOString(),
        fileSize: parseInt(metadata.size || '0'),
        filePath: file.name,
        downloadUrl: downloadUrl,
        publicId: file.name,
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
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_CLOUD_BUCKET_NAME) {
      console.warn('Google Cloud Storage credentials not configured');
      return [];
    }

    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({
      prefix: 'resumes/',
    });

    const resumes: ResumeFile[] = files.map((file) => {
      const pathParts = file.name.split('/');
      const studentUSN = pathParts[1] || '';
      const metadata = file.metadata;
      const fileName = metadata.metadata?.originalFileName || file.name.split('/').pop() || '';
      const storageFileName = file.name.split('/').pop() || '';
      const downloadUrl = getDownloadUrl(file.name);

      return {
        id: file.name,
        fileName: fileName,
        storageFileName: storageFileName,
        studentUSN: studentUSN,
        uploadDate: metadata.timeCreated || new Date().toISOString(),
        fileSize: parseInt(metadata.size || '0'),
        filePath: file.name,
        downloadUrl: downloadUrl,
        publicId: file.name,
      };
    });

    return resumes;
  } catch (error) {
    console.error('Error listing all resumes:', error);
    return [];
  }
}

// Delete resume from Google Cloud Storage
export async function deleteResume(filePath: string): Promise<boolean> {
  try {
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_CLOUD_BUCKET_NAME) {
      console.warn('Google Cloud Storage credentials not configured');
      return false;
    }

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    await file.delete();

    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
}

// Check if Google Cloud Storage is properly configured
export function isGoogleCloudStorageConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
    process.env.GOOGLE_CLOUD_BUCKET_NAME &&
    (process.env.GOOGLE_CLOUD_KEY_FILE || process.env.GOOGLE_CLOUD_CREDENTIALS)
  );
}
