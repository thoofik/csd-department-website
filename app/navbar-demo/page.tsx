import NavbarDemo from '@/components/navbar-menu-demo';

export default function NavbarDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavbarDemo />
      <div className="pt-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            Navbar Component Demo
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Features
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Smooth animations with Framer Motion</li>
              <li>• Hover effects and transitions</li>
              <li>• Dark mode support</li>
              <li>• Responsive design</li>
              <li>• Customizable menu items</li>
              <li>• Product showcase with images</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-white">
              Usage
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                {`import NavbarDemo from '@/components/navbar-menu-demo';

export default function MyPage() {
  return <NavbarDemo />;
}`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
