'use strict';

var YAML = require('yaml');
var polyfill = require('@js-temporal/polyfill');
var zod = require('zod');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var YAML__namespace = /*#__PURE__*/_interopNamespaceDefault(YAML);

var Maintenance = zod.z.object({
    since: zod.z.string().regex(/^\d{2}(:\d{2}(:\d{2}(\.\d{1,9})?)?)?$/),
    until: zod.z.string().regex(/^\d{2}(:\d{2}(:\d{2}(\.\d{1,9})?)?)?$/),
    timeZone: zod.z.string(),
});
var MaintenanceMap = zod.z.object({
    maintenance: zod.z.array(Maintenance),
});
var enableHours = function (inputSince, inputTo, timeZone, now) {
    if (now === void 0) { now = polyfill.Temporal.Now.instant(); }
    var nowPlainDate = now.toZonedDateTimeISO(timeZone);
    var timeSince = polyfill.Temporal.PlainTime.from(inputSince);
    var timeTo = polyfill.Temporal.PlainTime.from(inputTo);
    var zonedDateTimeSince = timeSince.toZonedDateTime({
        plainDate: nowPlainDate,
        timeZone: timeZone,
    });
    var zonedDateTimeTo = timeTo.toZonedDateTime({
        plainDate: nowPlainDate,
        timeZone: timeZone,
    });
    var timeDistance = zonedDateTimeSince.until(zonedDateTimeTo);
    if (timeDistance.total({ "unit": "minutes" }) < 0) {
        zonedDateTimeTo = zonedDateTimeTo.add({ days: 1 });
    }
    var isBetween = now.since(zonedDateTimeSince.toInstant()).total("milliseconds") > 0 &&
        now.until(zonedDateTimeTo.toInstant()).total("milliseconds") > 0;
    return isBetween;
};
var evaluateMaintenance = function (payload) {
    return enableHours(payload.since, payload.until, payload.timeZone);
};
var evaluateMaintenanceMap = function (payload) {
    return payload.maintenance.map(function (payload) {
        return enableHours(payload.since, payload.until, payload.timeZone);
    }).some(Boolean);
};
var evaluate = function (payload) {
    return evaluateMaintenanceMap(MaintenanceMap.parse(YAML__namespace.parse(payload)));
};

exports.Maintenance = Maintenance;
exports.MaintenanceMap = MaintenanceMap;
exports.enableHours = enableHours;
exports.evaluate = evaluate;
exports.evaluateMaintenance = evaluateMaintenance;
exports.evaluateMaintenanceMap = evaluateMaintenanceMap;
//# sourceMappingURL=index.js.map
