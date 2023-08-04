import * as code from "@actions/core";
import * as github from "@actions/github";
import { inspect } from "node:util";
import { evaluate } from ".";

const main = async () => {
  const option = code.getInput("option");
  const available = evaluate(option);
  code.setOutput("available", available);
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
