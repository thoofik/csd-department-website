import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

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

// Upload file to Firebase Storage
export async function uploadToFirebaseStorage(
  file: Buffer,
  fileName: string,
  contentType: string,
  studentUSN: string,
  originalFileName: string
): Promise<UploadResult> {
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_STORAGE_BUCKET) {
      return {
        success: false,
        message: 'Firebase credentials not configured',
      };
    }

    // Generate unique filename for storage
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const storageFileName = `${studentUSN}_${timestamp}.${fileExtension}`;
    const filePath = `resumes/${studentUSN}/${storageFileName}`;

    // Create a reference to the file
    const fileRef = ref(storage, filePath);

    // Upload file
    const snapshot = await uploadBytes(fileRef, file, {
      contentType: contentType,
      customMetadata: {
        originalFileName: originalFileName,
        studentUSN: studentUSN,
        uploadDate: new Date().toISOString(),
      },
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      fileName: fileName,
      originalFileName: originalFileName,
      fileUrl: downloadURL,
      publicId: filePath,
      message: 'File uploaded successfully to Firebase Storage',
    };
  } catch (error) {
    console.error('Firebase Storage upload error:', error);
    return {
      success: false,
      message: `Failed to upload file to Firebase Storage: ${error}`,
    };
  }
}

// Get download URL from Firebase Storage
export function getDownloadUrl(filePath: string): string {
  try {
    if (!process.env.FIREBASE_STORAGE_BUCKET) {
      throw new Error('Firebase Storage bucket not configured');
    }

    // Firebase Storage URLs are public by default
    return `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(filePath)}?alt=media`;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

// List all resumes for a specific student
export async function listStudentResumes(studentUSN: string): Promise<ResumeFile[]> {
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_STORAGE_BUCKET) {
      console.warn('Firebase credentials not configured');
      return [];
    }

    const folderRef = ref(storage, `resumes/${studentUSN}`);
    const result = await listAll(folderRef);

    const resumes: ResumeFile[] = [];

    for (const itemRef of result.items) {
      try {
        const metadata = await getMetadata(itemRef);
        const fileName = metadata.customMetadata?.originalFileName || itemRef.name;
        const storageFileName = itemRef.name;
        const downloadUrl = await getDownloadURL(itemRef);

        resumes.push({
          id: itemRef.fullPath,
          fileName: fileName,
          storageFileName: storageFileName,
          studentUSN: studentUSN,
          uploadDate: metadata.timeCreated || new Date().toISOString(),
          fileSize: metadata.size,
          filePath: itemRef.fullPath,
          downloadUrl: downloadUrl,
          publicId: itemRef.fullPath,
        });
      } catch (error) {
        console.error('Error getting metadata for file:', itemRef.name, error);
        // Continue with other files
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
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_STORAGE_BUCKET) {
      console.warn('Firebase credentials not configured');
      return [];
    }

    const resumesRef = ref(storage, 'resumes');
    const result = await listAll(resumesRef);

    const allResumes: ResumeFile[] = [];

    // Iterate through all student folders
    for (const folderRef of result.prefixes) {
      const studentUSN = folderRef.name;
      const studentResumes = await listStudentResumes(studentUSN);
      allResumes.push(...studentResumes);
    }

    return allResumes;
  } catch (error) {
    console.error('Error listing all resumes:', error);
    return [];
  }
}

// Delete resume from Firebase Storage
export async function deleteResume(filePath: string): Promise<boolean> {
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_STORAGE_BUCKET) {
      console.warn('Firebase credentials not configured');
      return false;
    }

    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);

    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    return false;
  }
}

// Check if Firebase is properly configured
export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_STORAGE_BUCKET &&
    process.env.FIREBASE_API_KEY
  );
}
