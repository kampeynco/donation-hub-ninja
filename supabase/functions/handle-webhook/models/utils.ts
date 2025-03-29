
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

/**
 * Logs database operations with consistent format
 */
export function logDbOperation(operation: string, entityId: string, requestId: string, details?: string) {
  console.log(`[${requestId}] ${operation}: ${entityId}${details ? ' - ' + details : ''}`);
}

/**
 * Generic error handler for database operations
 */
export function handleDatabaseError(
  error: any, 
  operation: string, 
  entityType: string,
  requestId: string, 
  timestamp: string,
  errorResponseFn: Function
) {
  console.error(`[${requestId}] Database error ${operation} ${entityType}:`, error);
  return { 
    success: false, 
    error: errorResponseFn(
      `Error ${operation} ${entityType}`,
      error.message,
      requestId,
      timestamp
    )
  };
}
