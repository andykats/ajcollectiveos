import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function BrandsPage() {
  const brands = [
    {
      name: "TechCollective",
      description: "A technology-focused collective specializing in software development and digital innovation.",
      industry: "Technology",
      location: "San Francisco, CA",
      members: "50+",
      founded: "2022"
    },
    {
      name: "Creative Commons Studio",
      description: "A design and creative collective bringing together artists, designers, and content creators.",
      industry: "Creative Arts",
      location: "New York, NY",
      members: "25+",
      founded: "2021"
    },
    {
      name: "Sustainable Futures Collective",
      description: "An environmental collective focused on sustainability consulting and green technology solutions.",
      industry: "Environmental",
      location: "Portland, OR",
      members: "35+",
      founded: "2023"
    },
    {
      name: "Community Health Network",
      description: "A healthcare collective providing community health services and wellness programs.",
      industry: "Healthcare",
      location: "Chicago, IL",
      members: "40+",
      founded: "2020"
    },
    {
      name: "Local Food Alliance",
      description: "A food and agriculture collective connecting local farmers with urban communities.",
      industry: "Food & Agriculture",
      location: "Austin, TX",
      members: "30+",
      founded: "2021"
    },
    {
      name: "Education Empowerment Collective",
      description: "An education-focused collective providing tutoring, workshops, and learning resources.",
      industry: "Education",
      location: "Boston, MA",
      members: "45+",
      founded: "2022"
    }
  ];

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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Our Brands & Partners
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto">
            Discover the diverse collectives and collaborative organizations that trust AJ Collective OS 
            to power their operations and drive their success. Each brand represents a unique approach 
            to collective work and community building.
          </p>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Collectives</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">6</div>
              <div className="text-gray-600 dark:text-gray-300">Industries</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">200+</div>
              <div className="text-gray-600 dark:text-gray-300">Total Members</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">15</div>
              <div className="text-gray-600 dark:text-gray-300">Cities</div>
            </div>
          </div>

          {/* Brands Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {brands.map((brand, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg text-gray-800 dark:text-white">
                      {brand.name}
                    </CardTitle>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs font-medium">
                      {brand.industry}
                    </span>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {brand.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="text-gray-700 dark:text-gray-300">{brand.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Members:</span>
                      <span className="text-gray-700 dark:text-gray-300">{brand.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Founded:</span>
                      <span className="text-gray-700 dark:text-gray-300">{brand.founded}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Join Our Growing Network
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Ready to transform your collective with our powerful platform? 
              Join the community of successful collectives already using AJ Collective OS.
            </p>
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Your Collective
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}