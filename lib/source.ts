import { docs } from "@/.source";
import { loader, type VirtualFile } from "fumadocs-core/source";

// `toFumadocsSource()` is typed as returning `{ files: VirtualFile[] }`, but
// the runtime actually returns a lazy `files()` getter — invoke it, since
// the loader expects the resolved file list.
const { files } = docs.toFumadocsSource() as unknown as {
  files: () => VirtualFile[];
};

export const source = loader({
  baseUrl: "/",
  source: { files: files() },
});
