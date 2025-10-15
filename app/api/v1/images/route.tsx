import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

import { getFontsFromTemplate, getFontUrl } from "@/lib/fonts"
import { convertTemplateImages } from "@/lib/image-converter-server"
import { templateSchema } from "@/lib/templates"
import { templates } from "@/components/templates"

export const runtime = "edge"

export const POST = async (request: NextRequest) => {
  const body = await request.json()

  const template = templateSchema.parse(body)

  // Convert WebP images to use conversion proxy
  const baseUrl = request.nextUrl.origin
  const convertedTemplate = await convertTemplateImages(template, baseUrl)

  const fonts = getFontsFromTemplate(convertedTemplate.params)
  const fontsResponses = await Promise.all(
    fonts.map((f) =>
      // Next.js automatically caches fetch requests
      fetch(getFontUrl({ family: f.family, weight: f.weight }))
    )
  )
  const fontBuffers = await Promise.all(
    fontsResponses.map((res) => res.arrayBuffer())
  )

  const { Template } = templates[convertedTemplate.name as keyof typeof templates]

  const response = new ImageResponse(
    (
      <Template
        // @ts-ignore
        template={convertedTemplate}
        renderWatermark
      />
    ),
    {
      width: convertedTemplate.canvas.width,
      height: convertedTemplate.canvas.height,
      fonts: fonts.map((f, i) => {
        return {
          name: f.family,
          weight: f.weight,
          data: fontBuffers[i],
          style: "normal" as const,
        }
      }),
    }
  )

  return response
}

