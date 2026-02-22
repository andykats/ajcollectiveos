"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [content, setContent] = useState({
    title: "About Us",
    subtitle: "Learn more about our company and mission",
    missionTitle: "Our Mission",
    missionText: "AJ Collective OS is designed to empower collectives, cooperatives, and collaborative organizations with powerful tools to manage their operations, track performance, and foster team collaboration.",
    visionTitle: "Our Vision",
    visionText: "We envision a world where collaborative organizations can operate efficiently and effectively, leveraging technology to amplify their impact and achieve their collective goals.",
    valuesTitle: "Our Values",
    valuesText: "Collaboration, Transparency, Innovation, and Community Impact are at the core of everything we do.",
    teamTitle: "Our Team",
    teamText: "We are a diverse group of professionals dedicated to building tools that make collaboration easier and more effective."
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content/about');
        if (response.ok) {
          const result = await response.json();
          if (result.token) {
            setContent(result.data);
          } else {
            console.error("Invalid token received");
          }
        }
      } catch (error) {
        console.error("Error loading content:", error);
      }
    };
    loadContent();
  }, []);

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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {content.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {content.subtitle}
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Mission Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                {content.missionTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {content.missionText}
              </p>
            </div>

            {/* Vision Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                {content.visionTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {content.visionText}
              </p>
            </div>

            {/* Values Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                {content.valuesTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {content.valuesText}
              </p>
            </div>

            {/* Team Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                {content.teamTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {content.teamText}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center mt-8">
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