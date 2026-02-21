import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white hover:opacity-80">
          AJ Collective OS
        </Link>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            About Us
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              AJ Collective OS is designed to empower collectives, cooperatives, and collaborative organizations 
              with powerful tools to manage their operations, track performance, and foster team collaboration. 
              We believe in making collective management accessible, efficient, and data-driven.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Our Values
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Transparency and openness</li>
                <li>• Collaborative decision-making</li>
                <li>• Data-driven insights</li>
                <li>• User-centric design</li>
                <li>• Continuous innovation</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                What We Offer
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Comprehensive analytics dashboard</li>
                <li>• Team collaboration tools</li>
                <li>• Performance tracking</li>
                <li>• Resource management</li>
                <li>• Secure authentication</li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join hundreds of collectives already using our platform to streamline their operations.
            </p>
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}