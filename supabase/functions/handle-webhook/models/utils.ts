
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
  const errorMessage = typeof error === 'object' ? JSON.stringify(error) : error.toString();
  console.error(`[${requestId}] Database error ${operation} ${entityType}:`, errorMessage);
  
  return { 
    success: false, 
    error: errorResponseFn(
      `Error ${operation} ${entityType}`,
      error.message || errorMessage,
      requestId,
      timestamp
    )
  };
}
