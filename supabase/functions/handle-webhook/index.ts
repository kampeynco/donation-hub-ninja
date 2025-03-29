
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { ActBlueWebhookPayload, WebhookErrorResponse, WebhookSuccessResponse } from "./types.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Generate a unique request ID for tracking
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  console.log(`[${requestId}] Request received: ${req.method}`);
  console.log(`[${requestId}] Request headers:`, JSON.stringify(Object.fromEntries(req.headers.entries())));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log(`[${requestId}] Responding to OPTIONS request with CORS headers`);
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create Supabase client using environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      const errorResponse: WebhookErrorResponse = {
        error: "configuration_error",
        code: 503,
        message: "Service unavailable due to configuration error",
        details: "Missing Supabase environment variables",
        request_id: requestId,
        timestamp: timestamp
      };
      
      console.error(`[${requestId}] Configuration error: Missing Supabase environment variables`);
      return new Response(JSON.stringify(errorResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 503,
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authentication check (using basic auth headers when present)
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Basic ")) {
      const encodedCredentials = authHeader.substring(6);
      const decodedCredentials = atob(encodedCredentials);
      const [username, password] = decodedCredentials.split(":");
      
      // Fetch webhook from database to verify credentials
      const { data: webhook, error: webhookError } = await supabase
        .from("webhooks")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();
      
      if (webhookError) {
        const errorResponse: WebhookErrorResponse = {
          error: "database_error",
          code: 503,
          message: "Error accessing webhook configuration",
          details: webhookError.message,
          request_id: requestId,
          timestamp: timestamp
        };
        
        console.error(`[${requestId}] Database error while fetching webhook:`, webhookError);
        return new Response(JSON.stringify(errorResponse), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 503,
        });
      }
      
      if (!webhook) {
        const errorResponse: WebhookErrorResponse = {
          error: "configuration_error",
          code: 404,
          message: "Webhook configuration not found",
          request_id: requestId,
          timestamp: timestamp
        };
        
        console.error(`[${requestId}] No active webhook configuration found`);
        return new Response(JSON.stringify(errorResponse), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }
      
      // Verify provided credentials against stored credentials
      if (username !== webhook.api_username || password !== webhook.api_password) {
        const errorResponse: WebhookErrorResponse = {
          error: "unauthorized",
          code: 401,
          message: "Invalid authentication credentials",
          request_id: requestId,
          timestamp: timestamp
        };
        
        console.error(`[${requestId}] Authentication failed: Invalid credentials provided`);
        return new Response(JSON.stringify(errorResponse), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }
      
      console.log(`[${requestId}] Authentication successful`);
    }
    
    // Method check - only accept POST
    if (req.method !== "POST") {
      const errorResponse: WebhookErrorResponse = {
        error: "method_not_allowed",
        code: 405,
        message: "Only POST method is allowed",
        request_id: requestId,
        timestamp: timestamp
      };
      
      console.error(`[${requestId}] Method not allowed: ${req.method}`);
      return new Response(JSON.stringify(errorResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Allow": "POST, OPTIONS" },
        status: 405,
      });
    }
    
    let payload: ActBlueWebhookPayload;
    try {
      // Parse the request body (ActBlue payload)
      payload = await req.json();
      console.log(`[${requestId}] Received ActBlue webhook payload:`, JSON.stringify(payload));
    } catch (error) {
      const errorResponse: WebhookErrorResponse = {
        error: "invalid_payload",
        code: 400,
        message: "Invalid JSON payload",
        details: error.message,
        request_id: requestId,
        timestamp: timestamp
      };
      
      console.error(`[${requestId}] Error parsing payload:`, error);
      return new Response(JSON.stringify(errorResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate payload structure
    if (!payload || !payload.contribution) {
      const errorResponse: WebhookErrorResponse = {
        error: "invalid_payload_structure",
        code: 422,
        message: "Invalid ActBlue payload format",
        details: "Missing contribution data in payload",
        request_id: requestId,
        timestamp: timestamp
      };
      
      console.error(`[${requestId}] Invalid payload structure:`, JSON.stringify(payload));
      return new Response(JSON.stringify(errorResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 422,
      });
    }

    const { contribution, donor, lineitems } = payload;
    
    // Get the first line item for the amount if not in contribution
    const lineItem = lineitems && lineitems.length > 0 ? lineitems[0] : null;
    
    if (!lineItem && !contribution.amount) {
      const errorResponse: WebhookErrorResponse = {
        error: "missing_amount",
        code: 422,
        message: "Donation amount not found",
        details: "Neither contribution.amount nor lineitem.amount is present",
        request_id: requestId,
        timestamp: timestamp
      };
      
      console.error(`[${requestId}] Missing donation amount in payload`);
      return new Response(JSON.stringify(errorResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 422,
      });
    }
    
    // Extract relevant data from the contribution
    const donationData = {
      amount: parseFloat(lineItem?.amount || contribution.amount || "0"),
      paid_at: new Date(lineItem?.paidAt || contribution.paidAt || contribution.createdAt).toISOString(),
      is_mobile: contribution.isMobile || false,
      recurring_period: contribution.recurringPeriod === 'monthly' ? 'monthly' : 
                       contribution.recurringPeriod === 'weekly' ? 'weekly' : 'once',
      recurring_duration: contribution.recurringDuration || 0,
      express_signup: contribution.expressSignup || false,
      is_express: contribution.isExpress || false,
      payment_type: contribution.isPaypal ? 'paypal' : 'credit',
      is_paypal: contribution.isPaypal || false,
    };

    // Extract donor information
    const donorData = {
      first_name: donor?.firstname || null,
      last_name: donor?.lastname || null,
      is_express: contribution.isExpress || false,
      is_mobile: contribution.isMobile || false,
      is_paypal: contribution.isPaypal || false,
    };

    console.log(`[${requestId}] Processed donation data:`, JSON.stringify(donationData));
    console.log(`[${requestId}] Processed donor data:`, JSON.stringify(donorData));

    // Process the donation
    let donorId;
    let donationId;
    let emailId;
    let locationId;
    
    // Transaction support would be ideal here, but not available in edge functions
    if (donor?.email) {
      try {
        // Try to find existing donor by email
        const { data: existingEmail, error: emailError } = await supabase
          .from("emails")
          .select("donor_id, email")
          .eq("email", donor.email)
          .maybeSingle();
        
        if (emailError) {
          const errorResponse: WebhookErrorResponse = {
            error: "database_error",
            code: 503,
            message: "Error looking up donor email",
            details: emailError.message,
            request_id: requestId,
            timestamp: timestamp
          };
          
          console.error(`[${requestId}] Database error looking up donor email:`, emailError);
          return new Response(JSON.stringify(errorResponse), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 503,
          });
        }

        if (existingEmail?.donor_id) {
          // Update existing donor
          donorId = existingEmail.donor_id;
          const { error: donorUpdateError } = await supabase
            .from("donors")
            .update(donorData)
            .eq("id", donorId);
          
          if (donorUpdateError) {
            const errorResponse: WebhookErrorResponse = {
              error: "database_error",
              code: 503,
              message: "Error updating donor",
              details: donorUpdateError.message,
              request_id: requestId,
              timestamp: timestamp
            };
            
            console.error(`[${requestId}] Database error updating donor:`, donorUpdateError);
            return new Response(JSON.stringify(errorResponse), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 503,
            });
          }
          
          console.log(`[${requestId}] Updated existing donor:`, donorId);
        } else {
          // Create new donor
          const { data: newDonor, error: donorError } = await supabase
            .from("donors")
            .insert(donorData)
            .select()
            .single();

          if (donorError) {
            const errorResponse: WebhookErrorResponse = {
              error: "database_error",
              code: 503,
              message: "Error creating donor",
              details: donorError.message,
              request_id: requestId,
              timestamp: timestamp
            };
            
            console.error(`[${requestId}] Database error creating donor:`, donorError);
            return new Response(JSON.stringify(errorResponse), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 503,
            });
          }

          donorId = newDonor.id;
          console.log(`[${requestId}] Created new donor:`, donorId);

          // Create email record
          const { data: newEmail, error: emailInsertError } = await supabase
            .from("emails")
            .insert({
              email: donor.email,
              donor_id: donorId,
            })
            .select()
            .single();
            
          if (emailInsertError) {
            const errorResponse: WebhookErrorResponse = {
              error: "database_error",
              code: 503,
              message: "Error creating email record",
              details: emailInsertError.message,
              request_id: requestId,
              timestamp: timestamp
            };
            
            console.error(`[${requestId}] Database error creating email record:`, emailInsertError);
            return new Response(JSON.stringify(errorResponse), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 503,
            });
          }
          
          emailId = newEmail.id;
          console.log(`[${requestId}] Created email record:`, emailId);
        }

        // Create donation record
        const { data: newDonation, error: donationError } = await supabase
          .from("donations")
          .insert({
            ...donationData,
            donor_id: donorId,
          })
          .select()
          .single();
          
        if (donationError) {
          const errorResponse: WebhookErrorResponse = {
            error: "database_error",
            code: 503,
            message: "Error creating donation",
            details: donationError.message,
            request_id: requestId,
            timestamp: timestamp
          };
          
          console.error(`[${requestId}] Database error creating donation:`, donationError);
          return new Response(JSON.stringify(errorResponse), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 503,
          });
        }
        
        donationId = newDonation.id;
        console.log(`[${requestId}] Created donation:`, donationId, "for donor:", donorId);
          
        // Handle address if provided
        if (donor.addr1 || donor.city || donor.state) {
          const { data: newLocation, error: locationError } = await supabase
            .from("locations")
            .insert({
              donor_id: donorId,
              street: donor.addr1 || '',
              city: donor.city || '',
              state: donor.state || '',
              zip: donor.zip || '',
              country: donor.country || '',
              type: 'main'
            })
            .select()
            .single();
            
          if (locationError) {
            // Log error but continue - address is not critical
            console.error(`[${requestId}] Database error creating location:`, locationError);
          } else {
            locationId = newLocation.id;
            console.log(`[${requestId}] Created location:`, locationId, "for donor:", donorId);
          }
        }
      } catch (databaseError) {
        const errorResponse: WebhookErrorResponse = {
          error: "database_error",
          code: 503,
          message: "Database operation failed",
          details: databaseError.message,
          request_id: requestId,
          timestamp: timestamp
        };
        
        console.error(`[${requestId}] Unexpected database error:`, databaseError);
        return new Response(JSON.stringify(errorResponse), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 503,
        });
      }
    } else {
      console.log(`[${requestId}] Anonymous donation - no email provided`);
      // Handle anonymous donation (no email)
      try {
        const { data: anonDonation, error: anonDonationError } = await supabase
          .from("donations")
          .insert({
            ...donationData,
            donor_id: null,
          })
          .select()
          .single();
          
        if (anonDonationError) {
          const errorResponse: WebhookErrorResponse = {
            error: "database_error",
            code: 503,
            message: "Error creating anonymous donation",
            details: anonDonationError.message,
            request_id: requestId,
            timestamp: timestamp
          };
          
          console.error(`[${requestId}] Database error creating anonymous donation:`, anonDonationError);
          return new Response(JSON.stringify(errorResponse), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 503,
          });
        }
        
        donationId = anonDonation.id;
        console.log(`[${requestId}] Created anonymous donation:`, donationId);
      } catch (databaseError) {
        const errorResponse: WebhookErrorResponse = {
          error: "database_error",
          code: 503,
          message: "Database operation failed for anonymous donation",
          details: databaseError.message,
          request_id: requestId,
          timestamp: timestamp
        };
        
        console.error(`[${requestId}] Unexpected database error for anonymous donation:`, databaseError);
        return new Response(JSON.stringify(errorResponse), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 503,
        });
      }
    }

    // Update webhook last_used_at timestamp
    try {
      const { error: webhookError } = await supabase
        .from("webhooks")
        .update({ last_used_at: timestamp })
        .eq("is_active", true);
        
      if (webhookError) {
        // Non-critical error, just log it
        console.error(`[${requestId}] Error updating webhook last_used_at:`, webhookError);
      }
    } catch (webhookUpdateError) {
      // Non-critical error, just log it
      console.error(`[${requestId}] Unexpected error updating webhook timestamp:`, webhookUpdateError);
    }

    // Return success response
    const successResponse: WebhookSuccessResponse = {
      success: true,
      message: "Donation processed successfully",
      donation: {
        id: donationId,
        ...donationData
      },
      donor: donorId ? { 
        id: donorId, 
        ...donorData,
        email: donor?.email,
        location: locationId ? {
          street: donor?.addr1,
          city: donor?.city,
          state: donor?.state,
          zip: donor?.zip,
          country: donor?.country
        } : null
      } : null,
      request_id: requestId,
      timestamp: timestamp
    };
    
    console.log(`[${requestId}] Webhook processed successfully`);
    return new Response(JSON.stringify(successResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Catch any unhandled errors
    const errorResponse: WebhookErrorResponse = {
      error: "server_error",
      code: 500,
      message: "Unexpected server error",
      details: error.message || "Unknown error",
      request_id: requestId,
      timestamp: timestamp
    };
    
    console.error(`[${requestId}] Unhandled error:`, error);
    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
