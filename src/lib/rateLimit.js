/**
 * Simple in-memory rate limiter for password reset requests
 * Note: This resets on server restart. For production at scale, consider using Redis.
 */

// Map to store rate limit data: key -> { count, resetTime }
const rateLimitStore = new Map();

// Configuration
const MAX_REQUESTS = 3; // Maximum requests allowed
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Check if a request should be rate limited
 * @param {string} key - Unique identifier (e.g., email or IP)
 * @returns {{ success: boolean, remaining: number, resetTime: Date }} - Rate limit status
 */
export function checkRateLimit(key) {
  const now = Date.now();
  const normalizedKey = key.toLowerCase().trim();
  
  // Get existing record or create new one
  let record = rateLimitStore.get(normalizedKey);
  
  // If no record exists or window has expired, create/reset
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }
  
  // Check if limit exceeded
  if (record.count >= MAX_REQUESTS) {
    const remaining = 0;
    const resetTime = new Date(record.resetTime);
    
    return {
      success: false,
      remaining,
      resetTime,
      retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
    };
  }
  
  // Increment count and save
  record.count += 1;
  rateLimitStore.set(normalizedKey, record);
  
  return {
    success: true,
    remaining: MAX_REQUESTS - record.count,
    resetTime: new Date(record.resetTime),
    retryAfterSeconds: 0,
  };
}

/**
 * Reset rate limit for a key (useful after successful password reset)
 * @param {string} key - Unique identifier to reset
 */
export function resetRateLimit(key) {
  const normalizedKey = key.toLowerCase().trim();
  rateLimitStore.delete(normalizedKey);
}

/**
 * Clean up expired entries (call periodically to prevent memory leaks)
 */
export function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Optional: Run cleanup every 30 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 30 * 60 * 1000);
}
