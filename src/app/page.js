import Navbar from "./components/navbar";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center py-20 md:py-28">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold text-green-800 text-center mb-4 relative z-10">
              The African Wave
            </h1>
            <div className="absolute -bottom-3 left-0 right-0 h-4 bg-green-500 opacity-40 transform -rotate-1 rounded-full"></div>
          </div>

          <p className="text-xl md:text-2xl text-green-700 italic mt-4">
            Shaping Authentic African Narratives
          </p>
        </div>
      </main>

      <footer className="bg-stone-100 text-green-800 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>
              &copy; {new Date().getFullYear()} The African Wave. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
