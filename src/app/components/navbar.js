import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-10 flex items-center justify-between p-4 bg-green-800 shadow-md">
      <div className="flex items-center">
        <div className="relative w-12 h-12 mr-3">
          <Image
            src="/logo.png"
            alt="The African Wave Logo"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <div className="text-white text-lg font-bold">The African Wave</div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
        <Link
          href="/"
          className="text-white hover:text-stone-200 transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-white hover:text-stone-200 transition-colors duration-200"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="text-white hover:text-stone-200 transition-colors duration-200"
        >
          Contact
        </Link>
        <Link
          href="/faq"
          className="text-white hover:text-stone-200 transition-colors duration-200"
        >
          FAQ
        </Link>
        <Link
          href="/sign-in"
          className="text-white hover:text-stone-200 transition-colors duration-200"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="px-4 py-1 bg-white text-green-800 rounded-full hover:bg-stone-100 transition-colors duration-200"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button className="text-white hover:text-stone-200 focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  );
}
