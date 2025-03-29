
// Hookdeck API utility module for interacting with Hookdeck services

export interface HookdeckConnectionConfig {
  name: string;
  userId: string;  // Used as the source name
  destinationId: string;
  transformationId?: string; // Optional transformation ID
}

export interface HookdeckSourceAuthConfig {
  sourceId: string;
  name: string;
  username: string;
  password: string;
}

/**
 * Creates a new Hookdeck connection with a webhook source
 * Uses the PUT method as specified in the Hookdeck API
 */
export async function createHookdeckConnection(config: HookdeckConnectionConfig): Promise<any> {
  const apiKey = Deno.env.get("HOOKDECK_API_KEY");
  if (!apiKey) {
    throw new Error("HOOKDECK_API_KEY is not configured");
  }

  const hookdeckPayload: any = {
    "id": `web_${crypto.randomUUID().replace(/-/g, '').substring(0, 10)}`,
    "name": config.name,
    "source": {
      "name": config.userId,
      "type": "WEBHOOK"
    },
    "destination_id": config.destinationId
  };
  
  // Add transformation rule if transformationId is provided
  if (config.transformationId) {
    hookdeckPayload.rules = [
      {
        "type": "transform",
        "transformation_id": config.transformationId
      }
    ];
  }

  console.log("Creating Hookdeck connection with payload:", JSON.stringify(hookdeckPayload));

  const response = await fetch("https://api.hookdeck.com/2025-01-01/connections", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(hookdeckPayload)
  });

  const responseText = await response.text();
  console.log(`Hookdeck connection creation response (${response.status}):`, responseText);

  if (!response.ok) {
    console.error("Hookdeck connection creation failed:", responseText);
    throw new Error(`Failed to create Hookdeck connection: ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.error("Failed to parse Hookdeck response:", e);
    return { text: responseText };
  }
}

/**
 * Configures authentication for a Hookdeck source
 * Uses the PUT method as specified in the Hookdeck API
 */
export async function configureHookdeckSourceAuth(config: HookdeckSourceAuthConfig): Promise<any> {
  const apiKey = Deno.env.get("HOOKDECK_API_KEY");
  if (!apiKey) {
    throw new Error("HOOKDECK_API_KEY is not configured");
  }

  const sourceUpdatePayload = {
    "id": config.sourceId,
    "name": config.name,
    "config": {
      "auth_type": "BASIC_AUTH",
      "auth": {
        "username": config.username,
        "password": config.password
      }
    }
  };

  console.log("Configuring Hookdeck source auth with payload:", JSON.stringify(sourceUpdatePayload));

  const response = await fetch("https://api.hookdeck.com/2025-01-01/sources", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(sourceUpdatePayload)
  });

  const responseText = await response.text();
  console.log(`Hookdeck source auth configuration response (${response.status}):`, responseText);

  if (!response.ok) {
    console.error("Hookdeck source auth configuration failed:", responseText);
    throw new Error(`Failed to configure Hookdeck source auth: ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.error("Failed to parse Hookdeck response:", e);
    return { text: responseText };
  }
}
