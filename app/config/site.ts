import { env } from "@/env.mjs";
import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Based World",
  description:
    "Explore through the most based communities all around the world. Base is for everyone.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
};
