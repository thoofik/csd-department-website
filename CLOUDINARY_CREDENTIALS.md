# Cloudinary Setup Instructions

## Your Cloudinary Credentials
Based on what you provided, here are your credentials:

- **Cloud Name**: csd-department
- **API Key**: 333714226429877
- **API Secret**: Bhpr2TcjzOho3AoSMG5VmlH6egE

## Setup Steps

### 1. Create Environment File
Create a file named `.env.local` in your project root directory with this content:

```env
CLOUDINARY_CLOUD_NAME=csd-department
CLOUDINARY_API_KEY=333714226429877
CLOUDINARY_API_SECRET=Bhpr2TcjzOho3AoSMG5VmlH6egE
```

### 2. Verify Setup
1. Make sure `.env.local` is in your `.gitignore` file (it should be by default)
2. Restart your development server: `npm run dev`
3. Go to the analytics page
4. Click on a student to open their full view
5. Try uploading a resume

### 3. Test Upload/Download
1. Select a PDF or Word document
2. Click "Upload Resume"
3. Check if it appears in the resume list
4. Test downloading the resume

## File Organization
Your files will be stored in Cloudinary like this:
```
csd-department/
├── resumes/
│   ├── 4PM22CG001/
│   │   ├── 4PM22CG001_1703123456789.pdf
│   │   └── 4PM22CG001_1703123456790.docx
│   ├── 4PM22CG002/
│   │   └── 4PM22CG002_1703123456791.pdf
│   └── ...
```

## Troubleshooting
If you encounter issues:
1. Check that `.env.local` exists and has the correct credentials
2. Restart your development server
3. Check the browser console for any error messages
4. Verify the file is a PDF, DOC, or DOCX format
5. Make sure the file is under 5MB

## Security Note
Never commit `.env.local` to git! It contains sensitive credentials. The file should be in your `.gitignore` by default.

Your Cloudinary storage is now ready to use! 🎉
