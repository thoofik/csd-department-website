import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1', // Changed default to ap-south-1
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

export interface UploadResult {
  success: boolean;
  fileName?: string;
  originalFileName?: string;
  fileUrl?: string;
  key?: string;
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
  key: string;
}

// Upload file to AWS S3
export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  studentUSN: string,
  originalFileName: string
): Promise<UploadResult> {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
      return {
        success: false,
        message: 'AWS S3 credentials not configured',
      };
    }

    // Generate unique filename for storage
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const storageFileName = `${studentUSN}_${timestamp}.${fileExtension}`;
    const key = `resumes/${studentUSN}/${storageFileName}`;

    // Upload parameters
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: {
        originalFileName: originalFileName,
        studentUSN: studentUSN,
        uploadDate: new Date().toISOString(),
      },
    };

    // Upload to S3
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Generate download URL
    const downloadUrl = await getSignedDownloadUrl(key);

    return {
      success: true,
      fileName: fileName,
      originalFileName: originalFileName,
      fileUrl: downloadUrl,
      key: key,
      message: 'File uploaded successfully to AWS S3',
    };
  } catch (error) {
    console.error('AWS S3 upload error:', error);
    return {
      success: false,
      message: `Failed to upload file to AWS S3: ${error}`,
    };
  }
}

// Get signed download URL from S3
export async function getSignedDownloadUrl(key: string): Promise<string> {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
      throw new Error('AWS S3 credentials not configured');
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    // Generate signed URL valid for 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

// List all resumes for a specific student
export async function listStudentResumes(studentUSN: string): Promise<ResumeFile[]> {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
      console.warn('AWS S3 credentials not configured');
      return [];
    }

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `resumes/${studentUSN}/`,
    });

    const response = await s3Client.send(command);
    const resumes: ResumeFile[] = [];

    if (response.Contents) {
      for (const object of response.Contents) {
        if (object.Key && object.LastModified) {
          try {
            // Get object metadata
            const getObjectCommand = new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: object.Key,
            });

            const objectResponse = await s3Client.send(getObjectCommand);
            const metadata = objectResponse.Metadata || {};
            
            const fileName = metadata.originalFileName || object.Key.split('/').pop() || '';
            const storageFileName = object.Key.split('/').pop() || '';
            const downloadUrl = await getSignedDownloadUrl(object.Key);

            resumes.push({
              id: object.Key,
              fileName: fileName,
              storageFileName: storageFileName,
              studentUSN: studentUSN,
              uploadDate: object.LastModified.toISOString(),
              fileSize: object.Size || 0,
              filePath: object.Key,
              downloadUrl: downloadUrl,
              key: object.Key,
            });
          } catch (error) {
            console.error('Error getting metadata for file:', object.Key, error);
            // Continue with other files
          }
        }
      }
    }

    return resumes;
  } catch (error) {
    console.error('Error listing student resumes:', error);
    return [];
  }
}

// List all resumes (for admin purposes)
export async function listAllResumes(): Promise<ResumeFile[]> {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
      console.warn('AWS S3 credentials not configured');
      return [];
    }

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'resumes/',
    });

    const response = await s3Client.send(command);
    const allResumes: ResumeFile[] = [];

    if (response.Contents) {
      for (const object of response.Contents) {
        if (object.Key && object.LastModified) {
          try {
            // Extract student USN from key path
            const keyParts = object.Key.split('/');
            if (keyParts.length >= 3 && keyParts[0] === 'resumes') {
              const studentUSN = keyParts[1];
              
              // Get object metadata
              const getObjectCommand = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: object.Key,
              });

              const objectResponse = await s3Client.send(getObjectCommand);
              const metadata = objectResponse.Metadata || {};
              
              const fileName = metadata.originalFileName || object.Key.split('/').pop() || '';
              const storageFileName = object.Key.split('/').pop() || '';
              const downloadUrl = await getSignedDownloadUrl(object.Key);

              allResumes.push({
                id: object.Key,
                fileName: fileName,
                storageFileName: storageFileName,
                studentUSN: studentUSN,
                uploadDate: object.LastModified.toISOString(),
                fileSize: object.Size || 0,
                filePath: object.Key,
                downloadUrl: downloadUrl,
                key: object.Key,
              });
            }
          } catch (error) {
            console.error('Error processing file:', object.Key, error);
            // Continue with other files
          }
        }
      }
    }

    return allResumes;
  } catch (error) {
    console.error('Error listing all resumes:', error);
    return [];
  }
}

// Delete resume from S3
export async function deleteResume(key: string): Promise<boolean> {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
      console.warn('AWS S3 credentials not configured');
      return false;
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
}

// Check if AWS S3 is properly configured
export function isS3Configured(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME &&
    process.env.AWS_REGION
  );
}
