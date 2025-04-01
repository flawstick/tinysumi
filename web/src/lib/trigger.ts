import { TriggerClient } from "@trigger.dev/sdk";

export const client = new TriggerClient({
  id: "tinyai",
  apiKey: process.env.TRIGGER_DEV_API_KEY!,
  apiUrl: "https://api.trigger.dev",
  verbose: true,
});
