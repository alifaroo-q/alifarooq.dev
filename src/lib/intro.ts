/**
 * The intro video, served from a Cloudflare R2 bucket on its own domain.
 *
 * `src` is the MP4's URL (H.264, faststart, about 1080p). `poster` is a still
 * from it, and `captions` is a WebVTT file, required so the video is usable muted; keep it in `public/` so it
 * is same-origin with the page, which a `<track>` needs. Leave the whole
 * value `null` and `/intro` shows a holding card, stays out of the sitemap
 * and carries `noindex`.
 */
export const INTRO_VIDEO: {
  src: string;
  poster?: string;
  captions: string;
} | null = null;

/** Must match what is said in the recording. Edit it when the script changes. */
export const INTRO_TRANSCRIPT = [
  "Hi, I'm Ali Farooq. I'm an AI full-stack engineer based in Karachi, and I'm looking for a remote role starting in November.",
  "For the past two years at Zenkoders, I've built AI products for clients, front to back. The one I'm proudest of is a voice agent that answers the phone and follows up by text. That follow-up took bookings from 31 to 49 a week.",
  "I also built an email assistant. It drafts sourced replies to 40 to 50 emails a day for each consultant, and a person checks every draft before it goes out. And a voice AI that answers the phone for restaurants in Belgium, in three languages.",
  "The AI is rarely the hard part. Making it work reliably for real people is, so that's where I put my time.",
  "If that sounds useful, my work and resume are at alifarooq dev. My email is hello at alifarooq dev. Thanks for watching.",
];
