"use client"

import { useEffect } from "react"
import Image from "next/image"
import { useTemplateStore } from "@/providers/template-store-provider"
import satori from "satori"

import { getFontsFromTemplate, getFontUrl } from "@/lib/fonts"
import { convertImageToPNG } from "@/lib/image-converter"
import { getIconCode, loadEmoji } from "@/lib/twemoji"
import { AspectRatio } from "@/components/ui/aspect-ratio"

import { templates } from "./templates"

/**
 * Recursively converts all WebP image URLs in template params to PNG
 */
async function convertTemplateImages(template: any): Promise<any> {
  const converted = { ...template }

  // Helper function to check if a value is a data URL
  const isDataUrl = (str: string) =>
    typeof str === "string" && str.startsWith("data:")

  // Helper function to recursively process objects
  const processValue = async (value: any): Promise<any> => {
    if (typeof value === "string" && isDataUrl(value)) {
      // Convert WebP data URLs to PNG
      return await convertImageToPNG(value)
    } else if (Array.isArray(value)) {
      // Process arrays recursively
      return await Promise.all(value.map(processValue))
    } else if (typeof value === "object" && value !== null) {
      // Process objects recursively
      const processed: any = {}
      for (const key in value) {
        processed[key] = await processValue(value[key])
      }
      return processed
    }
    return value
  }

  // Process the params object
  if (converted.params) {
    converted.params = await processValue(converted.params)
  }

  return converted
}

export default function PreviewRenderer() {
  const template = useTemplateStore((state) => state)

  async function renderSvg() {
    try {
      const fonts = getFontsFromTemplate(template.params)
      const fontsResponses = await Promise.all(
        fonts.map((f) =>
          // Next.js automatically caches fetch requests
          fetch(getFontUrl({ family: f.family, weight: f.weight }))
        )
      )
      const fontBuffers = await Promise.all(
        fontsResponses.map((res) => res.arrayBuffer())
      )

      // Convert WebP images in template params to PNG format
      const convertedTemplate = await convertTemplateImages(template)

      // get the template component based on the currently selected template
      const TemplateComp = templates[template.name].Template

      const svg = await satori(
        <TemplateComp
          // @ts-ignore
          template={convertedTemplate}
          renderWatermark
        />,
        {
          // debug: process.env.NODE_ENV === "development",
          width: template.canvas.width,
          height: template.canvas.height,
          fonts: fonts.map((f, i) => ({
            name: f.family,
            weight: f.weight,
            data: fontBuffers[i],
            style: "normal" as const,
          })),
          async loadAdditionalAsset(languageCode: string, segment: string) {
            if (languageCode === "emoji") {
              return (
                `data:image/svg+xml;base64,` +
                btoa(await loadEmoji(getIconCode(segment)))
              )
            }

            return []
          },
        }
      )

      template.updatePreviewSvg(svg)
    } catch (error) {
      console.error("Error rendering SVG:", error)
    }
  }

  useEffect(() => {
    renderSvg()
  }, [template.params, template.background, template.canvas])

  return (
    <AspectRatio ratio={16 / 9}>
      <Image
        alt="Preview"
        priority
        className="h-full w-full object-contain"
        width={template.canvas.width}
        height={template.canvas.height}
        src={
          template.previewSvg
            ? `data:image/svg+xml;utf8,${encodeURIComponent(template.previewSvg)}`
            : "/loading.svg"
        }
      />
    </AspectRatio>
  )
}
