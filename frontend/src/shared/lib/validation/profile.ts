export const PROFILE_VALIDATION = {
  bio: {
    maxLength: 2000,
    message: `Bio must be under ${2000} characters.`,
  },
  headline: {
    maxLength: 160,
    message: `Headline must be under ${160} characters.`,
  },
  skills: {
    maxItems: 30,
    maxItemLength: 40,
    message: `You can add up to ${30} skills, each under ${40} characters.`,
  },
  image: {
    avatar: {
      maxBytes: 2 * 1024 * 1024,
      maxMb: 2,
      accept: ["image/jpeg", "image/png", "image/gif", "image/webp"] as const,
      message: "Profile photo must be JPG, PNG, GIF or WebP under 2 MB.",
    },
    banner: {
      maxBytes: 10 * 1024 * 1024,
      maxMb: 10,
      accept: ["image/jpeg", "image/png", "image/webp"] as const,
      message: "Banner must be JPG, PNG or WebP under 10 MB.",
    },
  },
} as const;
