/**
 * Extracts a YouTube video ID from various input formats:
 * - Direct 11-char ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/watch?v=VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(input) {
  if (!input || typeof input !== 'string') return null;

  const str = input.trim();

  // Direct video ID (YouTube IDs are 11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  // Short link: https://youtu.be/VIDEO_ID
  const shortMatch = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Standard watch URL
  const watchMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Embed URL
  const embedMatch = str.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  return null;
}
