"use client"

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    {/* Header */}
    <header className="flex justify-between items-center p-6">
      <div className="text-2xl font-bold text-gray-800 dark:text-white">
        AJ Collective OS
      </div>
      
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          About Us
        </Link>
        <Link href="/portfolio" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          Portfolio
        </Link>
        <Link href="/brands" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          Brands
        </Link>
        <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          Contact
        </Link>
      </nav>
      
      <div className="hidden md:flex items-center gap-4">
        <ThemeToggle />
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </header>

    {/* Mobile Menu */}
    {isMenuOpen && (
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <nav className="px-6 py-4 space-y-2">
          <Link href="/about" className="block text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white py-2">
            About Us
          </Link>
          <Link href="/portfolio" className="block text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white py-2">
            Portfolio
          </Link>
          <Link href="/brands" className="block text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white py-2">
            Brands
          </Link>
          <Link href="/contact" className="block text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white py-2">
            Contact
          </Link>
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ThemeToggle />
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">Login</Button>
            </Link>
          </div>
        </nav>
      </div>
    )}

    {/* Hero Section */}
    <main className="container mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
          Welcome to AJ Collective OS
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          A comprehensive operating system for managing your collective&apos;s operations, 
          analytics, and team collaboration in one unified platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </main>

    {/* Features Section */}
    <section className="container mx-auto px-6 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Analytics Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Track performance metrics and gain insights into your collective&apos;s operations.
          </p>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-3xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Team Management
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Collaborate with your team and manage collective resources efficiently.
          </p>
        </div>
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-3xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Operations Tools
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Streamline workflows and manage collective operations seamlessly.
          </p>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="container mx-auto px-6 py-8 text-center text-gray-600 dark:text-gray-400">
      <p>&copy; 2024 AJ Collective OS. All rights reserved.</p>
    </footer>
  </div>
);
}
