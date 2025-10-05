# Cloudinary Storage Setup Guide

## Perfect Choice for Resume Storage! 🎉

Cloudinary offers **25GB free storage** + **25GB bandwidth** - perfect for your 4GB+ resume storage needs!

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a **free account**
3. Verify your email address

### 2. Get Your Credentials
1. Go to your Cloudinary Dashboard
2. Click on the **gear icon** (Settings) in the top right
3. Go to **"API Keys"** tab
4. Copy these values:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### 3. Set Environment Variables
Create a `.env.local` file in your project root:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### 4. Test the Setup
1. Start your development server: `npm run dev`
2. Go to the analytics page
3. Click on a student to open their full view
4. Try uploading a resume
5. Check if it appears in the resume list
6. Test downloading the resume

## File Organization in Cloudinary

Your files will be organized like this:
```
Cloudinary Storage:
├── resumes/
│   ├── 4PM22CG001/
│   │   ├── 4PM22CG001_1703123456789.pdf
│   │   └── 4PM22CG001_1703123456790.docx
│   ├── 4PM22CG002/
│   │   └── 4PM22CG002_1703123456791.pdf
│   └── ...
```

## Why Cloudinary is Perfect for Resumes

✅ **25GB Free Storage**: More than enough for 4GB+ resumes
✅ **25GB Free Bandwidth**: Plenty for downloads
✅ **Built for Media**: Optimized for file storage and delivery
✅ **CDN Included**: Fast global delivery
✅ **Image Optimization**: Can optimize PDFs if needed
✅ **Transformations**: Can resize, compress, etc.
✅ **Analytics**: Track usage and performance
✅ **No Credit Card**: Free tier is generous

## Advanced Features (Optional)

### Image Transformations
You can add transformations to URLs:
```javascript
// Compress PDF for faster download
const compressedUrl = cloudinary.url(publicId, {
  resource_type: 'raw',
  quality: 'auto',
  fetch_format: 'auto'
});
```

### Security
- **Signed URLs**: For private files
- **Access Control**: Restrict who can access files
- **Watermarking**: Add watermarks to resumes

### Analytics
- Track download counts
- Monitor bandwidth usage
- View file access patterns

## Troubleshooting

**Common Issues:**
- **"Cloudinary credentials not configured"**: Check your `.env.local` file
- **Upload fails**: Verify API credentials are correct
- **Download doesn't work**: Check if the file was uploaded successfully
- **File not found**: Verify the public ID format

**Debug Mode:**
Add this to see detailed logs:
```env
CLOUDINARY_LOG_LEVEL=debug
```

## Production Deployment

When deploying to production:
1. Add the same environment variables to your hosting platform
2. Consider upgrading to a paid plan for more storage/bandwidth
3. Enable CDN for faster global delivery
4. Set up monitoring and alerts

## Pricing (After Free Tier)

- **Free**: 25GB storage + 25GB bandwidth
- **Basic**: $89/month for 100GB storage + 100GB bandwidth
- **Advanced**: $179/month for 500GB storage + 500GB bandwidth

Perfect for scaling as your resume collection grows! 🚀
