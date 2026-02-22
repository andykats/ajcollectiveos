import { NextRequest, NextResponse } from "next/server"

// Mock data storage - in production, this would connect to your database
const contentData = {
  about: {
    title: "About Us",
    subtitle: "Learn more about our company and mission",
    missionTitle: "Our Mission",
    missionText: "AJ Collective OS is designed to empower collectives, cooperatives, and collaborative organizations with powerful tools to manage their operations, track performance, and foster team collaboration.",
    visionTitle: "Our Vision",
    visionText: "We envision a world where collaborative organizations can operate efficiently and effectively, leveraging technology to amplify their impact and achieve their collective goals.",
    valuesTitle: "Our Values",
    valuesText: "Collaboration, Transparency, Innovation, and Community Impact are at the core of everything we do.",
    teamTitle: "Our Team",
    teamText: "We are a diverse group of professionals dedicated to building tools that make collaboration easier and more effective.",
    updatedAt: new Date().toISOString()
  }
}

// Simple token generation function (in production, use JWT or similar)
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params
    
    if (!contentData[type as keyof typeof contentData]) {
      return NextResponse.json({ 
        error: "Content type not found",
        token: null 
      }, { status: 404 })
    }

    return NextResponse.json({
      token: generateToken(),
      data: contentData[type as keyof typeof contentData]
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      token: null 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params
    const body = await request.json()

    if (!contentData[type as keyof typeof contentData]) {
      return NextResponse.json({ 
        error: "Content type not found",
        token: null 
      }, { status: 404 })
    }

    // Update the content
    contentData[type as keyof typeof contentData] = {
      ...contentData[type as keyof typeof contentData],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      token: generateToken(),
      message: "Content updated successfully",
      data: contentData[type as keyof typeof contentData]
    })
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      token: null 
    }, { status: 500 })
  }
}