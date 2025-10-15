import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

export const runtime = "nodejs" // Use Node.js runtime for sharp

/**
 * Proxy endpoint that converts WebP images to PNG
 * Usage: /api/convert-image?url=https://example.com/image.webp
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const imageUrl = searchParams.get("url")

    if (!imageUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
    }

    // Fetch the original image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      )
    }

    const imageBuffer = await response.arrayBuffer()

    // Convert to PNG using sharp
    const pngBuffer = await sharp(Buffer.from(imageBuffer)).png().toBuffer()

    // Return as PNG
    return new NextResponse(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error converting image:", error)
    return NextResponse.json(
      { error: "Failed to convert image" },
      { status: 500 }
    )
  }
}
