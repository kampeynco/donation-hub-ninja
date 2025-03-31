
/**
 * Extract user ID from request headers
 */
export function extractUserId(req: Request, requestId: string): string | null {
  const hd_user_id = req.headers.get("X-HD-Userid");
  const userId = hd_user_id || req.headers.get("source-name") || null;
  
  if (userId) {
    console.log(`[${requestId}] Request associated with user: ${userId}`);
  } else {
    console.log(`[${requestId}] No user ID found in request headers`);
  }
  
  return userId;
}
