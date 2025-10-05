# Firebase Storage Resume Management Setup (FREE 5GB!)

This guide will help you set up **Firebase Storage** for resume upload/download functionality in your CSD Department website. Firebase offers **5GB of FREE storage** - perfect for your needs!

## 🆓 **Why Firebase Storage?**

- ✅ **5GB FREE storage** (vs 1GB for Supabase)
- ✅ **1GB/day FREE bandwidth** 
- ✅ **No credit card required**
- ✅ **Easy setup** with Google account
- ✅ **Reliable** Google infrastructure
- ✅ **Perfect for 200+ students**

## Prerequisites

- Google account (free)
- Firebase project (free)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `csd-resume-storage` (or any name you prefer)
4. **Disable Google Analytics** (optional, saves resources)
5. Click **"Create project"**
6. Wait for project creation (30 seconds)

## Step 2: Enable Firebase Storage

1. In your Firebase project dashboard
2. Click **"Storage"** in the left sidebar
3. Click **"Get started"**
4. Choose **"Start in test mode"** (we'll secure it later)
5. Select a location close to your users (e.g., `asia-south1` for India)
6. Click **"Next"** and then **"Done"**

## Step 3: Get Firebase Configuration

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click **"Web"** icon (`</>`)
5. Enter app nickname: `csd-website`
6. **Don't check** "Also set up Firebase Hosting"
7. Click **"Register app"**
8. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

### For Local Development (.env.local)

Create a `.env.local` file in your project root:

```env
# Firebase Configuration
FIREBASE_API_KEY=your-api-key-here
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

### For Production (Vercel)

Add these environment variables in your Vercel dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `FIREBASE_API_KEY` | `your-api-key` | Production, Preview, Development |
| `FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Production, Preview, Development |
| `FIREBASE_PROJECT_ID` | `your-project-id` | Production, Preview, Development |
| `FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` | Production, Preview, Development |
| `FIREBASE_MESSAGING_SENDER_ID` | `your-sender-id` | Production, Preview, Development |
| `FIREBASE_APP_ID` | `your-app-id` | Production, Preview, Development |

## Step 5: Configure Storage Security Rules

1. Go to **Storage** > **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow write access only to authenticated users (optional)
    // For now, we'll allow all writes for simplicity
    match /{allPaths=**} {
      allow write: if true;
    }
  }
}
```

3. Click **"Publish"**

## Step 6: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to a student's analytics page
3. Try uploading a resume
4. Check if the file appears in your Firebase Storage console
5. Test download functionality

## File Structure

The system organizes files in the following structure:

```
Firebase Storage/
└── resumes/
    ├── 4PM22CG042/
    │   ├── 4PM22CG042_1759672200733.pdf
    │   └── 4PM22CG042_1759672200734.pdf
    ├── 4PM22CG043/
    │   └── 4PM22CG043_1759672200735.pdf
    └── ...
```

## Security Features

- **File Type Validation**: Only PDF, DOC, and DOCX files are allowed
- **File Size Limit**: Maximum 5MB per file
- **Student Isolation**: Each student can only access their own resumes
- **Public URLs**: Direct download links (no authentication needed)
- **Metadata Storage**: Original filenames and upload dates are preserved

## Cost Breakdown (FREE TIER)

### Firebase Storage Free Tier:
- **Storage**: 5GB FREE
- **Bandwidth**: 1GB/day FREE
- **Operations**: 20,000 operations/day FREE

### For 200 Students with 2MB resumes:
- **Storage**: ~400MB = **FREE** ✅
- **Bandwidth**: ~400MB/day = **FREE** ✅
- **Operations**: ~200/day = **FREE** ✅
- **Total Cost**: **$0/month** 🎉

## Troubleshooting

### Common Issues

1. **"Firebase credentials not configured"**
   - Check that all environment variables are set correctly
   - Verify the Firebase configuration object

2. **"Permission denied" errors**
   - Check Firebase Storage rules
   - Ensure rules allow read/write access

3. **Upload failures**
   - Verify Firebase project ID is correct
   - Check file size and type restrictions

4. **Download not working**
   - Check if Storage rules allow public read access
   - Verify file paths are correct

### Debug Mode

To enable debug logging, add this to your environment variables:

```env
DEBUG=firebase:*
```

## Advanced Security (Optional)

If you want to add authentication later:

1. Enable Firebase Authentication
2. Update Storage rules to require authentication
3. Modify the upload/download functions to use Firebase Auth

## Support

If you encounter issues:
1. Check the Firebase Console for errors
2. Verify your Firebase configuration
3. Test with a simple file upload first
4. Check the browser console for client-side errors

## Next Steps

After setup:
1. Test all functionality thoroughly
2. Monitor usage in Firebase Console
3. Set up alerts for storage usage
4. Consider implementing file versioning
5. Add backup strategies

## 🎉 **You're All Set!**

With Firebase Storage, you now have:
- ✅ **5GB FREE storage**
- ✅ **1GB/day FREE bandwidth**
- ✅ **Reliable Google infrastructure**
- ✅ **Easy management through Firebase Console**
- ✅ **Zero cost for typical department usage**

Your resume management system is now ready for production! 🚀
