import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PortfolioPage() {
  const projects = [
    {
      title: "Collective Analytics Platform",
      description: "A comprehensive analytics dashboard for tracking collective performance metrics, member engagement, and operational efficiency.",
      technologies: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
      status: "Live",
      year: "2024"
    },
    {
      title: "Team Collaboration Hub",
      description: "An integrated workspace for collective teams to manage projects, share resources, and coordinate activities.",
      technologies: ["React", "Node.js", "PostgreSQL", "Socket.io"],
      status: "Live",
      year: "2024"
    },
    {
      title: "Resource Management System",
      description: "A sophisticated system for managing collective resources, inventory tracking, and allocation workflows.",
      technologies: ["Vue.js", "Express", "MongoDB", "Docker"],
      status: "In Development",
      year: "2024"
    },
    {
      title: "Member Onboarding Platform",
      description: "Streamlined onboarding process for new collective members with training modules and integration workflows.",
      technologies: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
      status: "Completed",
      year: "2023"
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
            Our Portfolio
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center max-w-3xl mx-auto">
            Explore our collection of innovative solutions designed to empower collectives 
            and collaborative organizations. Each project represents our commitment to 
            building tools that foster collaboration and drive success.
          </p>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {projects.map((project, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl text-gray-800 dark:text-white">
                      {project.title}
                    </CardTitle>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === "Live" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : project.status === "In Development"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Year: {project.year}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Ready to Transform Your Collective?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join the growing community of collectives using our platform to streamline operations 
              and enhance collaboration.
            </p>
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}