# Public Assets Directory

Place your images and other static files here:

## 📁 Image Files
- **Faculty Photos**: Add faculty member photos here
- **Department Logo**: Place your CSD department logo
- **Lab Images**: Add photos of your facilities and labs
- **Event Photos**: Include images from department events
- **Achievement Photos**: Add photos related to student/faculty achievements

## 🖼️ Recommended Image Formats
- **Photos**: `.jpg`, `.jpeg`, `.png` (optimized for web)
- **Logos**: `.svg`, `.png` (with transparent background)
- **Icons**: `.svg`, `.png`

## 📱 Image Sizes
- **Faculty Photos**: 400x400px (square, 1:1 ratio)
- **Hero Images**: 1920x1080px (16:9 ratio)
- **Gallery Images**: 800x600px (4:3 ratio)
- **Logos**: 200x200px or larger

## 🔗 How to Use
After adding images to this folder, reference them in `app/page.tsx`:

```tsx
// Example: Update faculty photos
const facultyMembers = [
  {
    name: "Dr. Pramod",
    image: "/dr-pramod.jpg", // This will look for /public/dr-pramod.jpg
    // ... other details
  }
]
```

## 📝 Current Placeholder Images
The website currently uses placeholder images from Unsplash. Replace these with your actual department photos for a personalized experience.
