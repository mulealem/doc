import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// Required by Next.js for route handlers under `output: "export"`: with no
// dynamic dependencies, `next build` prerenders the search index into a
// static JSON file (out/api/search.json) that the client-side search dialog
// downloads once and indexes with Orama.
export const dynamic = "force-static";

export const { staticGET: GET } = createFromSource(source);
