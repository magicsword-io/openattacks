import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import {
  getSuggestionConfig,
  handleSuggestion,
  suggestionResponse,
} from "./suggestions.server";

export const GET: APIRoute = ({ isPrerendered }) =>
  suggestionResponse({
    enabled: !isPrerendered && Boolean(getSuggestionConfig(process.env)),
  });

export const POST: APIRoute = (context) =>
  handleSuggestion(context.request, {
    config: getSuggestionConfig(process.env),
    address: import.meta.env.DEV
      ? context.clientAddress
      : context.request.headers.get("x-vercel-forwarded-for"),
    incidentExists: async (id) => Boolean(await getEntry("attacks", id)),
  });
