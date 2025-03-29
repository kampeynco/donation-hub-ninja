
// Hookdeck API utility module for interacting with Hookdeck services

export interface HookdeckSourceConfig {
  name: string;
  url: string;
  customerId: string;
}

export interface HookdeckDestinationConfig {
  name: string;
  url: string;
  customerId: string;
}

export interface HookdeckConnectionConfig {
  name: string;
  sourceId: string;
  destinationId: string;
  customerId: string;
}

/**
 * Creates a new Hookdeck source
 */
export async function createHookdeckSource(config: HookdeckSourceConfig): Promise<any> {
  const apiKey = Deno.env.get("HOOKDECK_API_KEY");
  if (!apiKey) {
    throw new Error("HOOKDECK_API_KEY is not configured");
  }

  const response = await fetch("https://api.hookdeck.com/2025-01-01/sources", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      name: config.name,
      url: config.url,
      type: "webhook",
      customer_id: config.customerId
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Hookdeck source creation failed:", error);
    throw new Error(`Failed to create Hookdeck source: ${error}`);
  }

  return await response.json();
}

/**
 * Creates a new Hookdeck destination
 */
export async function createHookdeckDestination(config: HookdeckDestinationConfig): Promise<any> {
  const apiKey = Deno.env.get("HOOKDECK_API_KEY");
  if (!apiKey) {
    throw new Error("HOOKDECK_API_KEY is not configured");
  }

  const response = await fetch("https://api.hookdeck.com/2025-01-01/destinations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      name: config.name,
      url: config.url,
      type: "http",
      customer_id: config.customerId
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Hookdeck destination creation failed:", error);
    throw new Error(`Failed to create Hookdeck destination: ${error}`);
  }

  return await response.json();
}

/**
 * Creates a new Hookdeck connection between a source and destination
 */
export async function createHookdeckConnection(config: HookdeckConnectionConfig): Promise<any> {
  const apiKey = Deno.env.get("HOOKDECK_API_KEY");
  if (!apiKey) {
    throw new Error("HOOKDECK_API_KEY is not configured");
  }

  const response = await fetch("https://api.hookdeck.com/2025-01-01/connections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      name: config.name,
      source_id: config.sourceId,
      destination_id: config.destinationId,
      customer_id: config.customerId
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Hookdeck connection creation failed:", error);
    throw new Error(`Failed to create Hookdeck connection: ${error}`);
  }

  return await response.json();
}

/**
 * Updates a Hookdeck source URL
 */
export async function updateHookdeckSourceUrl(sourceId: string, url: string): Promise<any> {
  const apiKey = Deno.env.get("HOOKDECK_API_KEY");
  if (!apiKey) {
    throw new Error("HOOKDECK_API_KEY is not configured");
  }

  const response = await fetch(`https://api.hookdeck.com/2025-01-01/sources/${sourceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      url: url
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Hookdeck source update failed:", error);
    throw new Error(`Failed to update Hookdeck source: ${error}`);
  }

  return await response.json();
}
