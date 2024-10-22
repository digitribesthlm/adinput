import Image from 'next/image';

export default function Home() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME;

  return (
    <div className="relative min-h-screen flex flex-col">
      <Image
        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
        alt="Digital cityscape"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        className="z-0"
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
      
      <div className="relative z-20 flex-grow flex flex-col">
        {/* Header Section */}
        <header className="w-full py-6">
          <div className="container mx-auto px-6 flex justify-between items-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">{brandName}</h1>
            <button className="btn btn-outline btn-sm sm:btn-md border-white text-white hover:bg-white hover:text-gray-800 transition-all duration-300">
              Connect Now
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center bg-gray-900 bg-opacity-80 p-12 rounded-lg shadow-2xl max-w-3xl mx-auto transform hover:scale-105 transition-all duration-300">
            <h2 className="text-5xl font-extrabold text-white mb-6">Your PPC Marketing Hub</h2>
            <p className="text-lg text-gray-300 mb-8">
              Welcome to {brandName}, where we empower businesses to maximize their ROI through effective PPC advertising. 
              Our innovative tools and insights are designed to help you navigate the complexities of digital ad campaigns and achieve outstanding results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-2">For Advertisers</h3>
                <ul className="list-disc list-inside text-gray-300">
                  <li>Access advanced PPC management tools</li>
                  <li>Data-driven analytics for optimizing campaigns</li>
                  <li>Expert networking opportunities to enhance strategies</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-2">For Innovators</h3>
                <ul className="list-disc list-inside text-gray-300">
                  <li>Collaborate on cutting-edge ad projects</li>
                  <li>Stay ahead with the latest PPC trends</li>
                  <li>Participate in skill-building workshops focused on PPC strategies</li>
                </ul>
              </div>
            </div>
            <button className="btn btn-primary btn-lg px-8 py-3 font-bold hover:scale-110 transform transition-all duration-300 ease-in-out">
              Join {brandName}
            </button>
          </div>
        </main>

        {/* Footer Section */}
        <footer className="w-full py-6">
          <div className="container mx-auto text-center">
            <p className="text-sm text-gray-400">&copy; 2024 {brandName}. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors underline">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors underline">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}