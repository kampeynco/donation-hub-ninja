
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { 
  validateAuth, 
  extractUserId, 
  handleCorsPreflightRequest, 
  validateRequestMethod 
} from "../auth/index.ts";

// Re-export all auth middleware functions
export { 
  validateAuth, 
  extractUserId, 
  handleCorsPreflightRequest, 
  validateRequestMethod 
};
