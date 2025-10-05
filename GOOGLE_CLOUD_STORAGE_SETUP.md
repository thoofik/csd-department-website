# Google Cloud Storage Resume Management Setup

This guide will help you set up Google Cloud Storage for resume upload/download functionality in your CSD Department website.

## Prerequisites

- Google Cloud Platform account
- Google Cloud Storage bucket
- Service account with appropriate permissions

## Step 1: Create Google Cloud Storage Bucket

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **Cloud Storage** > **Buckets**
4. Click **Create Bucket**
5. Choose a unique bucket name (e.g., `csd-resumes-[your-project-id]`)
6. Select a location for your bucket
7. Choose **Standard** storage class
8. Set access control to **Uniform**
9. Click **Create**

## Step 2: Create Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Enter a name (e.g., `csd-resume-service`)
4. Add description: "Service account for CSD resume management"
5. Click **Create and Continue**
6. Add the following roles:
   - **Storage Admin** (for full bucket access)
   - **Storage Object Admin** (for object operations)
7. Click **Continue** and then **Done**

## Step 3: Generate Service Account Key

1. Click on your newly created service account
2. Go to **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Click **Create**
6. Download the JSON file and keep it secure

## Step 4: Configure Environment Variables

### For Local Development (.env.local)

Create a `.env.local` file in your project root:

```env
# Google Cloud Storage Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=csd-resumes-your-project-id
GOOGLE_CLOUD_KEY_FILE=path/to/your/service-account-key.json

# Alternative: Use credentials as JSON string
# GOOGLE_CLOUD_CREDENTIALS={"type":"service_account","project_id":"..."}
```

### For Production (Vercel)

Add these environment variables in your Vercel dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `GOOGLE_CLOUD_PROJECT_ID` | `your-project-id` | Production, Preview, Development |
| `GOOGLE_CLOUD_BUCKET_NAME` | `csd-resumes-your-project-id` | Production, Preview, Development |
| `GOOGLE_CLOUD_CREDENTIALS` | `{"type":"service_account",...}` | Production, Preview, Development |

**Note:** For Vercel, use the `GOOGLE_CLOUD_CREDENTIALS` environment variable with the entire JSON content of your service account key file.

## Step 5: Configure Bucket Permissions

### Option 1: Public Access (Simpler)

1. Go to your bucket in Google Cloud Console
2. Click on **Permissions** tab
3. Click **Add Principal**
4. Add `allUsers` as principal
5. Grant **Storage Object Viewer** role
6. Click **Save**

### Option 2: Private Access with Signed URLs (More Secure)

Keep bucket private and use signed URLs for downloads (this is the default implementation).

## Step 6: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to a student's analytics page
3. Try uploading a resume
4. Check if the file appears in your Google Cloud Storage bucket
5. Test download functionality

## File Structure

The system organizes files in the following structure:

```
your-bucket/
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
- **Signed URLs**: Secure download links that expire after 1 hour
- **Metadata Storage**: Original filenames and upload dates are preserved

## Troubleshooting

### Common Issues

1. **"Google Cloud Storage credentials not configured"**
   - Check that all environment variables are set correctly
   - Verify the service account key file path

2. **"Permission denied" errors**
   - Ensure the service account has proper roles
   - Check bucket permissions

3. **Upload failures**
   - Verify bucket name is correct
   - Check file size and type restrictions

4. **Download not working**
   - Check if bucket is public or signed URLs are configured
   - Verify file paths are correct

### Debug Mode

To enable debug logging, add this to your environment variables:

```env
DEBUG=google-cloud-storage
```

## Cost Considerations

Google Cloud Storage pricing (as of 2024):
- **Storage**: $0.020 per GB per month
- **Operations**: $0.05 per 10,000 operations
- **Network**: $0.12 per GB egress

For a typical department with 200 students uploading 2MB resumes:
- Storage: ~400MB = $0.008/month
- Operations: Minimal cost
- **Total estimated cost**: < $1/month

## Support

If you encounter issues:
1. Check the Google Cloud Console logs
2. Verify your service account permissions
3. Test with a simple file upload first
4. Check the browser console for client-side errors

## Next Steps

After setup:
1. Test all functionality thoroughly
2. Set up monitoring and alerts
3. Consider implementing file versioning
4. Add backup strategies
5. Monitor usage and costs
