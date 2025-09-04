# CSD Department Website - PESITM

A modern, responsive website for the Computer Science and Design Department at PES Institute of Technology and Management. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **Fast Performance**: Built with Next.js for optimal performance
- **Easy Customization**: Simple to modify content, add photos, and update links
- **SEO Optimized**: Built-in SEO features and metadata
- **Vercel Ready**: Easy deployment to Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project**
```bash
   # If you have git installed
   git clone <your-repo-url>
   cd csd-department-website
   
   # Or simply extract the downloaded files
   ```

2. **Install dependencies**
```bash
npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Adding Photos

1. **Place your images** in the `public/` folder
2. **Update image references** in `app/page.tsx`:
   ```tsx
   // Example: Update faculty photos
   const facultyMembers = [
     {
       name: "Dr. Pramod",
       image: "/your-photo.jpg", // Update this path
       // ... other details
     }
   ]
   ```

3. **Add gallery images** by creating a new section in the page

### Adding External Links

1. **Update the footer links** in `app/page.tsx`:
   ```tsx
   // In the Footer component
   <div>
     <h4>External Portals</h4>
     <ul>
       <li>
         <a href="https://your-portal.com" target="_blank" rel="noopener noreferrer">
           Your Portal Name
         </a>
       </li>
     </ul>
   </div>
   ```

2. **Add navigation links** by updating the `navItems` array in the Navigation component

### Updating Department Information

1. **Edit content** directly in `app/page.tsx`
2. **Update faculty details** in the `facultyMembers` array
3. **Modify achievements** in the `achievements` array
4. **Change facilities information** in the `facilities` array

### Styling Changes

1. **Colors**: Update the color scheme in `tailwind.config.js`
2. **Fonts**: Modify font families in `tailwind.config.js`
3. **Custom CSS**: Add styles in `app/globals.css`

## 📱 Sections

The website includes the following sections:

- **Hero Section**: Main landing area with call-to-action buttons
- **About Section**: Department overview and key features
- **Faculty Section**: Faculty member profiles and contact information
- **Achievements Section**: Student and department accomplishments
- **Facilities Section**: Lab information and equipment details
- **Contact Section**: Contact form and department contact details
- **Footer**: Quick links and external portal connections

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. **Push your code** to GitHub/GitLab/Bitbucket
2. **Go to [vercel.com](https://vercel.com)** and sign in
3. **Click "New Project"**
4. **Import your repository**
5. **Deploy** - Vercel will automatically detect Next.js and deploy

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
```bash
   vercel
   ```

4. **Follow the prompts** to complete deployment

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/csd-department-website)

## 🔧 Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📁 Project Structure

```
csd-department-website/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## 🎯 Key Technologies

- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Responsive Design**: Mobile-first approach

## 📝 Content Management

### Easy Updates

- **Faculty Information**: Update the `facultyMembers` array
- **Achievements**: Modify the `achievements` array
- **Facilities**: Edit the `facilities` array
- **Contact Details**: Update contact information in the ContactSection
- **External Links**: Modify footer links

### Adding New Sections

1. **Create a new component** in `app/page.tsx`
2. **Add it to the main page** component
3. **Update navigation** if needed
4. **Style with Tailwind CSS** classes

## 🌟 Features for Future Enhancement

- **Image Gallery**: Add a photo gallery section
- **News/Updates**: Blog or news section
- **Student Portal**: Student-specific information
- **Events Calendar**: Department events and activities
- **Research Publications**: Faculty research and publications
- **Alumni Network**: Alumni information and connections

## 📞 Support

For questions or customization help:
- **Email**: hodcsd@pestrust.edu.in
- **Phone**: 9886890174
- **Address**: NH 206, Sagar Road, Shivamogga – 577 204

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the CSD Department, PESITM**
