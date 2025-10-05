# AWS S3 Resume Management Setup (FREE 5GB for 12 Months!)

This guide will help you set up **AWS S3** for resume upload/download functionality in your CSD Department website. AWS offers **5GB FREE storage for 12 months** - perfect for your needs!

## 🆓 **Why AWS S3?**

- ✅ **5GB FREE storage for 12 months**
- ✅ **20,000 GET requests FREE**
- ✅ **2,000 PUT requests FREE**
- ✅ **No credit card required for free tier**
- ✅ **Reliable AWS infrastructure**
- ✅ **Perfect for 200+ students**

## Prerequisites

- AWS account (free to create)
- AWS S3 bucket (free tier)

## Step 1: Create AWS Account

1. Go to [AWS Console](https://aws.amazon.com/)
2. Click **"Create an AWS Account"**
3. Enter your email and password
4. **Choose "Personal" account type**
5. **Skip credit card** (free tier doesn't require it)
6. Verify your phone number
7. Choose **"Basic Support - Free"**
8. Complete account creation

## Step 2: Create S3 Bucket

1. **Sign in to AWS Console**
2. **Search for "S3"** in the services search bar
3. **Click "S3"** service
4. **Click "Create bucket"**
5. **Bucket name:** `csd-resumes-bucket-yourusn` (must be globally unique)
6. **Region:** Choose `us-east-1` (N. Virginia) for best performance
7. **Uncheck "Block all public access"** (we need public read access)
8. **Check the acknowledgment** that you understand the implications
9. **Click "Create bucket"**

## Step 3: Configure Bucket Permissions

1. **Click on your bucket name**
2. **Go to "Permissions" tab**
3. **Scroll down to "Bucket policy"**
4. **Click "Edit"**
5. **Add this policy:**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

6. **Replace `your-bucket-name`** with your actual bucket name
7. **Click "Save changes"**

## Step 4: Create IAM User

1. **Search for "IAM"** in AWS services
2. **Click "IAM"** service
3. **Click "Users"** in the left sidebar
4. **Click "Create user"**
5. **User name:** `csd-resume-manager`
6. **Click "Next"**
7. **Select "Attach policies directly"**
8. **Search for and select "AmazonS3FullAccess"**
9. **Click "Next"** and then **"Create user"**

## Step 5: Create Access Keys

1. **Click on your user** (`csd-resume-manager`)
2. **Go to "Security credentials" tab**
3. **Scroll down to "Access keys"**
4. **Click "Create access key"**
5. **Select "Application running outside AWS"**
6. **Click "Next"**
7. **Add description:** `CSD Resume Management`
8. **Click "Create access key"**
9. **Copy the Access Key ID and Secret Access Key** (save these securely!)

## Step 6: Configure Environment Variables

### For Local Development (.env.local)

Create a `.env.local` file in your project root:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1
```

### For Production (Vercel)

Add these environment variables in your Vercel dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `AWS_ACCESS_KEY_ID` | `your-access-key-id` | Production, Preview, Development |
| `AWS_SECRET_ACCESS_KEY` | `your-secret-access-key` | Production, Preview, Development |
| `AWS_S3_BUCKET_NAME` | `your-bucket-name` | Production, Preview, Development |
| `AWS_REGION` | `us-east-1` | Production, Preview, Development |

## Step 7: Test the Setup

1. **Save your Vercel environment variables**
2. **Redeploy your Vercel project** (it should auto-deploy)
3. **Test the resume upload/download functionality**

## File Structure

The system organizes files in the following structure:

```
AWS S3 Bucket/
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
- **Signed URLs**: Secure download links with 1-hour expiration
- **Metadata Storage**: Original filenames and upload dates are preserved

## Cost Breakdown (FREE TIER)

### AWS S3 Free Tier (12 Months):
- **Storage**: 5GB FREE
- **Requests**: 20,000 GET + 2,000 PUT FREE
- **Data Transfer**: 1GB/month FREE

### For 200 Students with 2MB resumes:
- **Storage**: ~400MB = **FREE** ✅
- **Requests**: ~200/day = **FREE** ✅
- **Data Transfer**: ~400MB/month = **FREE** ✅
- **Total Cost**: **$0/month** 🎉

## Troubleshooting

### Common Issues

1. **"AWS S3 credentials not configured"**
   - Check that all environment variables are set correctly
   - Verify the AWS credentials are valid

2. **"Access Denied" errors**
   - Check bucket permissions
   - Verify IAM user has S3FullAccess policy
   - Ensure bucket policy allows public read access

3. **Upload failures**
   - Verify AWS credentials are correct
   - Check bucket name and region
   - Ensure file size and type restrictions are met

4. **Download not working**
   - Check if bucket policy allows public read access
   - Verify signed URL generation
   - Check file paths are correct

### Debug Mode

To enable debug logging, add this to your environment variables:

```env
DEBUG=aws-sdk:*
```

## Advanced Security (Optional)

If you want to add more security:

1. **Create custom IAM policy** with minimal permissions
2. **Use bucket encryption** for sensitive data
3. **Implement access logging** for audit trails
4. **Add MFA** for additional security

## Support

If you encounter issues:
1. Check the AWS Console for errors
2. Verify your S3 bucket configuration
3. Test with a simple file upload first
4. Check the browser console for client-side errors

## Next Steps

After setup:
1. Test all functionality thoroughly
2. Monitor usage in AWS Console
3. Set up billing alerts (optional)
4. Consider implementing file versioning
5. Add backup strategies

## 🎉 **You're All Set!**

With AWS S3, you now have:
- ✅ **5GB FREE storage for 12 months**
- ✅ **20,000 requests FREE**
- ✅ **Reliable AWS infrastructure**
- ✅ **Easy management through AWS Console**
- ✅ **Zero cost for typical department usage**

Your resume management system is now ready for production! 🚀

## Important Notes

- **Free tier expires after 12 months** - you'll need to either pay or migrate to another service
- **Monitor your usage** in AWS Console to avoid unexpected charges
- **Keep your access keys secure** - never commit them to version control
- **Consider setting up billing alerts** to monitor costs
