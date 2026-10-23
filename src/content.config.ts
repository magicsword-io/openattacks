import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { entryErrors } from "./lib/schema.mjs";

const attacksDirectory = new URL("../attacks/", import.meta.url);
const attacks = defineCollection({
  loader: {
    name: "validated-attack-yaml",
    async load({ store, parseData, generateDigest, watcher, logger }) {
      const sync = async () => {
        const entries = [];
        for (const filename of (await readdir(attacksDirectory)).filter(
          (name) => name.endsWith(".yaml"),
        )) {
          const raw = await readFile(
            new URL(filename, attacksDirectory),
            "utf8",
          );
          const input = parse(raw);
          const errors = entryErrors(input, filename);
          if (errors.length) throw new Error(errors.join("\n"));
          const { typefully, ...publicData } = input;
          const data = await parseData({ id: publicData.id, data: publicData });
          entries.push({
            id: publicData.id,
            data,
            digest: generateDigest(raw),
            filePath: `attacks/${filename}`,
          });
        }
        store.clear();
        for (const entry of entries) store.set(entry);
      };
      await sync();
      if (watcher)
        watcher.on("all", async (event, path) => {
          if (
            path.startsWith(fileURLToPath(attacksDirectory)) &&
            path.endsWith(".yaml") &&
            ["add", "change", "unlink"].includes(event)
          ) {
            try {
              await sync();
            } catch (error) {
              logger.error(String(error));
            }
          }
        });
    },
  },
  schema: z.any().superRefine((data, ctx) => {
    for (const message of entryErrors(data, `${data?.id}.yaml`))
      ctx.addIssue({ code: "custom", message });
  }),
});
export const collections = { attacks };
