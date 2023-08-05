import { spawnSync } from "node:child_process";
import { groupTags, TagData } from "./fill-document.utils";
import { readFile, writeFile } from "node:fs/promises";

const [, , destination] = process.argv;
const main = async () => {
  const { status, stdout, stderr } = spawnSync("git", ["show-ref", "--tags"]);

  if (status !== 0) {
    throw new Error(
      `Invalid error satus ${status}: ${new TextDecoder().decode(stderr)}`,
    );
  }

  const prefixRef = `refs/tags/`;

  const tags = new TextDecoder()
    .decode(stdout)
    .split("\n")
    .filter(Boolean)
    .map((s): TagData => {
      const [hash, ref] = s.split(" ", 2);
      return { hash, ref, tag: ref.substring(prefixRef.length) };
    });

  const payloadReplace = Array.from(groupTags(tags)).map((s) =>
    ` - ${Array.from(s).map((s) => `\`${s.tag}\``).join(", ")}\n`
  ).join("");

  const exp = /<!-- block:versions:(start|end) -->/g;
  const documentPayload = await readFile(destination, "utf-8");
  const matchStart = exp.exec(documentPayload);
  const matchEnd = exp.exec(documentPayload);

  if (!matchStart || !matchEnd) return;

  const matchStartPoint = matchStart.index + matchStart[0].length;
  const matchEndPoint = matchEnd.index;

  const endDocument = `${
    documentPayload.substring(0, matchStartPoint)
  }\n${payloadReplace}\n${documentPayload.substring(matchEndPoint)}`;

  await writeFile(destination, endDocument);
};

main().catch(console.error);
