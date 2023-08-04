import * as code from "@actions/core";
import * as github from "@actions/github";
import { inspect } from "node:util";
import * as YAML from "yaml";
import { evaluate } from ".";

const main = async () => {
  const blockStep: boolean = YAML.parse(code.getInput("blockStep"));
  const option = code.getInput("option");
  const available = evaluate(option);
  code.setOutput("available", available);
  if (blockStep) {
    code.setFailed("Is blocked");
  }
};

const captureMessage = (ex: unknown): string => {
  if (ex instanceof Error) return ex.message;
  if (typeof ex === "string") return ex;
  return inspect(ex, { depth: undefined });
};

main().catch((ex) => {
  code.setFailed(captureMessage(ex));
  console.error(ex);
});
