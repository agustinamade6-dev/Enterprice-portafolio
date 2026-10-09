import { ContentRepository } from "./repository";
import { JsonAdapter } from "./adapters/jsonAdapter";

// In the future, if we switch to Postgres/Supabase, we just swap the adapter here.
// e.g., export const contentRepo: ContentRepository = new SupabaseAdapter();

export const contentRepo: ContentRepository = new JsonAdapter();
