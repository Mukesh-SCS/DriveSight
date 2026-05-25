export const SITE_CONFIG = {
  name: "DriveSight",
  tagline: "DMV & learner permit practice tests for all 50 states",
  defaultDescription:
    "Free DMV learner permit practice tests, road signs study guides, and category quizzes for all 50 US states. Track progress and review missed questions.",
  locale: "en_US",
  twitterHandle: "@drivesight",
  get baseUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
      /\/$/,
      "",
    );
  },
} as const;
