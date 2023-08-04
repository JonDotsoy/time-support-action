import { beforeAll, test } from "vitest";
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import * as YAML from "yaml";
import "@js-temporal/polyfill";
import { Temporal } from "@js-temporal/polyfill";
import {
  enableHours as evaluateRangeHours,
  evaluateMaintenance,
  evaluateMaintenanceMap,
} from ".";

const workspaceDirectory = new URL("__test_workspace__/", import.meta.url);

beforeAll(async () => {
  if (existsSync(workspaceDirectory)) {
    await rm(workspaceDirectory, { recursive: true });
  }
  await mkdir(workspaceDirectory, { recursive: true });
  await writeFile(new URL(".gitignore", workspaceDirectory), "*");
});

test("evaluate range time", () => {
  console.log(
    evaluateRangeHours("19:50", "20:01:20.222222234", "America/Santiago"),
  );
});

test("", () => {
  evaluateMaintenance({
    since: "19:23:23.1",
    until: "20:23",
    timeZone: "America/Santiago",
  });

  evaluateMaintenanceMap({
    maintenance: [
      {
        since: "19:23:23.1",
        until: "20:23",
        timeZone: "America/Santiago",
      },
    ],
  });
});
