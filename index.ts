import * as YAML from "yaml";
import { Temporal } from "@js-temporal/polyfill";
import { z } from "zod";

export const Maintenance = z.object({
  since: z.string().regex(/^\d{2}(:\d{2}(:\d{2}(\.\d{1,9})?)?)?$/),
  until: z.string().regex(/^\d{2}(:\d{2}(:\d{2}(\.\d{1,9})?)?)?$/),
  timeZone: z.string(),
});

export const MaintenanceMap = z.object({
  maintenance: z.array(Maintenance),
});

export const enableHours = (
  inputSince: string,
  inputTo: string,
  timeZone: string,
  now = Temporal.Now.instant(),
) => {
  const nowPlainDate = now.toZonedDateTimeISO(timeZone);
  const timeSince = Temporal.PlainTime.from(inputSince);
  const timeTo = Temporal.PlainTime.from(inputTo);

  const zonedDateTimeSince = timeSince.toZonedDateTime({
    plainDate: nowPlainDate,
    timeZone,
  });

  let zonedDateTimeTo = timeTo.toZonedDateTime({
    plainDate: nowPlainDate,
    timeZone,
  });

  const timeDistance = zonedDateTimeSince.until(zonedDateTimeTo);

  if (timeDistance.total({ "unit": "minutes" }) < 0) {
    zonedDateTimeTo = zonedDateTimeTo.add({ days: 1 });
  }

  const isBetween =
    now.since(zonedDateTimeSince.toInstant()).total("milliseconds") > 0 &&
    now.until(zonedDateTimeTo.toInstant()).total("milliseconds") > 0;

  return isBetween;
};

export const evaluateMaintenance = (payload: z.infer<typeof Maintenance>) => {
  return enableHours(payload.since, payload.until, payload.timeZone);
};

export const evaluateMaintenanceMap = (
  payload: z.infer<typeof MaintenanceMap>,
) => {
  return payload.maintenance.map((payload) =>
    enableHours(payload.since, payload.until, payload.timeZone)
  ).some(Boolean);
};

export const evaluate = (payload: string) => {
  return evaluateMaintenanceMap(MaintenanceMap.parse(YAML.parse(payload)));
};
