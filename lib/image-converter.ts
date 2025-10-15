/**
 * Converts images (especially WebP) to PNG format that Satori can handle
 * @param dataUrl - The data URL or remote URL of the image
 * @returns Promise<string> - PNG data URL
 */
export async function convertImageToPNG(dataUrl: string): Promise<string> {
  // If it's already a supported format (PNG, JPG, JPEG), return as is
  if (
    dataUrl.startsWith("data:image/png") ||
    dataUrl.startsWith("data:image/jpeg") ||
    dataUrl.startsWith("data:image/jpg")
  ) {
    return dataUrl
  }

  // For SVG, return as is since Satori supports it
  if (dataUrl.startsWith("data:image/svg+xml")) {
    return dataUrl
  }

  // For remote URLs (not data URLs), return as is
  // They will be handled by the server-side conversion
  if (!dataUrl.startsWith("data:")) {
    return dataUrl
  }

  // Convert WebP and other data URL formats to PNG
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Failed to get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0)

        // Convert to PNG
        const pngDataUrl = canvas.toDataURL("image/png")
        resolve(pngDataUrl)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = dataUrl
  })
}
