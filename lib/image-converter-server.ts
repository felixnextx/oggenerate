/**
 * Server-side image utilities for Edge Runtime
 * Handles WebP images for Satori/ImageResponse compatibility
 */

/**
 * Check if a URL points to a WebP image
 */
function isWebPUrl(url: string): boolean {
  return (
    url.toLowerCase().includes(".webp") || url.startsWith("data:image/webp")
  )
}

/**
 * Check if a URL is a data URL
 */
function isDataUrl(url: string): boolean {
  return url.startsWith("data:")
}

/**
 * Convert WebP URL to use our conversion proxy
 */
function convertWebPUrl(url: string, baseUrl?: string): string {
  if (!isWebPUrl(url) || isDataUrl(url)) {
    return url
  }

  // Use the conversion API endpoint to convert WebP to PNG
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || ""
  return `${base}/api/convert-image?url=${encodeURIComponent(url)}`
}

/**
 * Recursively converts all WebP image URLs in template params to use conversion proxy
 */
export async function convertTemplateImages(
  template: any,
  baseUrl?: string
): Promise<any> {
  const converted = { ...template }

  const processValue = (value: any): any => {
    if (typeof value === "string") {
      // Convert remote WebP URLs to use our proxy
      if (!isDataUrl(value) && isWebPUrl(value)) {
        return convertWebPUrl(value, baseUrl)
      }
      return value
    } else if (Array.isArray(value)) {
      return value.map(processValue)
    } else if (typeof value === "object" && value !== null) {
      const processed: any = {}
      for (const key in value) {
        processed[key] = processValue(value[key])
      }
      return processed
    }
    return value
  }

  if (converted.params) {
    converted.params = processValue(converted.params)
  }

  return converted
}


