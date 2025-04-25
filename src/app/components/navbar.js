import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4 bg-gray-800">
            <div className="text-white text-lg font-bold">The African Wave</div>
            <div className="space-x-4">
                <Link href="/" className="text-white hover:text-gray-300">Home</Link>
                <Link href="/about" className="text-white hover:text-gray-300">About</Link>
                <Link href="/contact" className="text-white hover:text-gray-300">Contact</Link>
                <Link href="/sign-in" className="text-white hover:text-gray-300">Sign In</Link>
                <Link href="/sign-up" className="text-white hover:text-gray-300">Sign Up</Link>
                <Link href="/faq" className="text-white hover:text-gray-300">FAQ</Link>
            </div>
        </nav>
    );
}