let textInputBox = qs("#text-input");
let logsBody = qs("#logs-table tbody");
let ipCountBody = qs("#ip-count-table tbody");

on("#parse-btn", "click", () => {
    let logs = parseAccessLogs(textInputBox.value);
    let maxLogRowCount = 1000;
    let logIndex = 1;
    logsBody.innerHTML = "";
    for (const log of logs) {
        logsBody.append( buildLogLine(log, logIndex++) );
        if (logIndex > maxLogRowCount) {
            break;
        }
    }
    let ipFrequency = calcFrequency(getColumn(logs, "ip"));
    ipFrequency = Object.entries(ipFrequency);
    ipFrequency = sortBy(ipFrequency, [1, -1], 0);
    let filteredIpFrequency = ipFrequency.filter(entry => entry[1] > 100);
    filteredIpFrequency = filteredIpFrequency.slice(0, 10);
    if (filteredIpFrequency.length == 0) {
        filteredIpFrequency = ipFrequency.slice(0, 10);
    }
    let ipIndex = 1;
    ipCountBody.innerHTML = "";
    for (const entry of filteredIpFrequency) {
        ipCountBody.append( buildRequestCountLine(entry, ipIndex++) );
    }
});

function buildLogLine(log, index) {
    return elem(
        "tr",
        {
            "class" : "*:px-2 *:py-[2px] *:border hover:bg-slate-50",
        },
        [
            elem("td", index),
            elem("td", log.ip),
            elem("td", log.identity),
            elem("td", log.user),
            elem("td", log.datetime),
            elem("td", log.method),
            elem("td", log.path),
            elem("td", log.protocol),
            elem("td", log.status),
            elem("td", log.length),
            elem("td", log.referrer),
            elem("td", log.ua),
        ],
    );
}

function buildRequestCountLine(entry, index) {
    return elem(
        "tr",
        {
            "class" : "*:px-2 *:py-[2px] *:border hover:bg-slate-50",
        },
        [
            elem("td", index),
            elem("td", entry[0]),
            elem("td", entry[1]),
        ],
    );
}
