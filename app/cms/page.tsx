import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileTextIcon, GlobeIcon, CameraIcon, BuildingIcon, EditIcon } from "lucide-react"
import Link from "next/link"

export default function CMSDashboard() {
  const contentTypes = [
    {
      title: "About Us",
      description: "Manage your company information and mission statement",
      icon: GlobeIcon,
      href: "/cms/about",
      color: "text-blue-600"
    },
    {
      title: "Contact Us",
      description: "Update contact information and business hours",
      icon: FileTextIcon,
      href: "/cms/contact",
      color: "text-green-600"
    },
    {
      title: "Portfolio",
      description: "Manage your portfolio projects and case studies",
      icon: CameraIcon,
      href: "/cms/portfolio",
      color: "text-purple-600"
    },
    {
      title: "Brands",
      description: "Manage brand partnerships and collaborations",
      icon: BuildingIcon,
      href: "/cms/brands",
      color: "text-orange-600"
    }
  ]

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* CMS Header */}
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management System</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage your website content</p>
                  </div>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">Back to Dashboard</Button>
                  </Link>
                </div>

                {/* Content Types Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8">
                  {contentTypes.map((content) => {
                    const Icon = content.icon
                    return (
                      <Card key={content.title} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${content.color}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{content.title}</CardTitle>
                              <CardDescription>{content.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Link href={content.href} className="flex-1">
                              <Button className="w-full">
                                <EditIcon className="h-4 w-4 mr-2" />
                                Edit Content
                              </Button>
                            </Link>
                            <Link href={`/${content.title.toLowerCase().replace(' ', '')}`} className="flex-1">
                              <Button variant="outline" className="w-full">
                                View Page
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">4</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Pages</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">4</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Published Pages</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Content Blocks</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-purple-600">2</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Draft Pages</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}