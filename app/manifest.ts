import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OG 图片生成器 - Felix's Blog",
    short_name: "OG生成器",
    description: "免费在线 Open Graph 图片生成工具，支持多种模板样式，轻松创建精美社交媒体分享图",
    start_url: "/",
    display: "standalone",
    theme_color: "#ffffff",
    background_color: "#ffffff",
  }
}
