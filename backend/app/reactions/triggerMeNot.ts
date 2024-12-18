import ReactionTrigger from "../types/ReactionTrigger.ts";
import z from "zod";

export const FetchSettings = z.object({
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string()),
  body: z.string(),
});

async function fetchRequest(reaction: ReactionTrigger) {
  const settings = FetchSettings.parse(reaction.settings);

  const fetchOptions: RequestInit = {
    method: settings.method,
  };

  if (settings.headers) {
    fetchOptions.headers = settings.headers;
  }

  if (settings.method !== "GET" && settings.method !== "HEAD") {
    fetchOptions.body = settings.body;
  }

  const response = await fetch(settings.url, fetchOptions);
  await response.text(); // Consume the response body
  return response;
}

export default {
  fetchRequest,
};
