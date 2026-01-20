export const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";
export const IMGBB_EXPIRATION =
  process.env.NEXT_PUBLIC_IMGBB_EXPIRATION || "";

const GENERATION_SERVER = process.env.NEXT_PUBLIC_GENERATION_SERVER || "";

export const GENERATION_CHAT_URL = GENERATION_SERVER
  ? new URL("/chat", GENERATION_SERVER).toString()
  : "";

export const GENERATION_IMAGE_URL = GENERATION_SERVER
  ? new URL("/generate", GENERATION_SERVER).toString()
  : "";
