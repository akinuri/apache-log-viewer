function arrayCombine(keys, values) {
    let combined = {};
    for (let i = 0; i < keys.length; i++) {
        let value = null;
        if (i in values) {
            value = values[i];
        }
        combined[keys[i]] = value;
    }
    return combined;
}

function calcFrequency(array) {
    let frequency = {};
    for (const item of array) {
        if (frequency[item]) {
            frequency[item]++;
        } else {
            frequency[item] = 1;
        }
    }
    return frequency;
}

function getColumn(array, columnName) {
    return array.map(item => {
        if (typeof columnName == "string" && columnName.includes(".")) {
            return getObjProp(item, columnName);
        }
        else if (typeof columnName == "function") {
            return columnName(item);
        }
        return item[columnName];
    });
}

function getObjProp(obj, path, fallback) {
    const pathProps = path.split(".");
    let prop = obj;
    for (let i = 0; i < pathProps.length; i++) {
        const pathProp = pathProps[i];
        if (prop && prop.hasOwnProperty(pathProp)) {
            prop = prop[pathProp];
        } else {
            return fallback;
        }
    }
    return prop;
}

function sortBy(array, firstColumnName, secondColumnName) {
    let firstColDir = 1;
    let secondColDir = 1;
    if (firstColumnName instanceof Array) {
        firstColDir = firstColumnName[1];
        firstColumnName = firstColumnName[0];
    }
    if (secondColumnName instanceof Array) {
        secondColDir = secondColumnName[1];
        secondColumnName = secondColumnName[0];
    }
    return array.sort((a, b) => {
        const valueA = a[firstColumnName];
        const valueB = b[firstColumnName];
        if (valueA < valueB) {
            return -1 * firstColDir;
        }
        if (valueA > valueB) {
            return 1 * firstColDir;
        }
        if (secondColumnName) {
            const secondValueA = a[secondColumnName];
            const secondValueB = b[secondColumnName];
            if (secondValueA < secondValueB) {
                return -1 * secondColDir;
            }
            if (secondValueA > secondValueB) {
                return 1 * secondColDir;
            }
        }
        return 0;
    });
}

function getMonthIndexByName(monthName) {
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    let index = months.findIndex(month => {
        return month == monthName || month.slice(0, 3) == monthName;
    });
    if (index !== -1) {
        index++;
    } else {
        index = null;
    }
    if (index) {
        index = (index).toString().padStart(2, "0");
    }
    return index;
}

function isoDateTimeFromParsedDate(obj) {
    let datetime = "";
    if (obj.year && obj.month && obj.day) {
        let date = [obj.year, obj.month, obj.day].join("-");
        datetime += date;
    }
    if (obj.hour && obj.minute && obj.second) {
        let time = [obj.hour, obj.minute, obj.second].join(":");
        if (datetime) {
            datetime += " ";
        }
        datetime += time;
    }
    if (obj.timezone) {
        if (datetime) {
            datetime += " ";
        }
        datetime += obj.timezone;
    }
    return datetime;
}

function isoDateFromParsedDate(obj) {
    let date = null;
    if (obj.year && obj.month && obj.day) {
        date = [obj.year, obj.month, obj.day].join("-");
    }
    return date;
}

function parseISODateTime(dateStr) {
    let parts = dateStr.split(/-|\s|:/);
    let namedParts = arrayCombine(["year", "month", "day", "hour", "minute", "second", "timezone"], parts);
    return namedParts;
}

function trimTextWhitespace(text) {
    let lines = text.split("\n");
    lines = lines.map(line => line.trim());
    lines = lines.filter(line => line);
    text = lines.join("\n");
    return text;
}

function debounce(callback, delay = 1000) {
    var timeoutHandle = null;
    let debounceInner = function debounceInner() {
        let passedArgs = Array.from(arguments);
        clearTimeout(timeoutHandle);
        timeoutHandle = setTimeout(function () {
            callback.apply(this, passedArgs);
        }.bind(this), delay || 1000);
    };
    if (!(this instanceof Window)) {
        debounceInner = debounceInner.bind(this);
    }
    return debounceInner;
}

function sum() {
    let numbers = Array.from(arguments).flat(Infinity);
    return numbers.reduce(
        function (sum, currentValue) {
            return sum + (parseFloat(currentValue) || 0);
        },
        0,
    );
}

function isQuoted(value) {
    return value.match(/^['"].*['"]$/) != null;
}

function unquote(value) {
    if (isQuoted(value)) {
        return value.slice(1, -1);
    }
    return value;
}

function ellipsis(string, maxLength, ellipsis = "...", trimLoc = "right", trimWS = false) {
    if (!string) {
        return string;
    }
    const validTrimLocs = ["left", "center", "right", "sides"];
    if (!validTrimLocs.includes(trimLoc)) {
        throw new Error("Invalid $trimLoc (" + trimLoc + ") argument.");
    }
    let ellipsisLength = ellipsis.length;
    if (trimLoc === "sides") {
        ellipsisLength *= 2;
    }
    let subString = string;
    const subStringLength = maxLength - ellipsisLength;
    if (string.length > maxLength) {
        switch (trimLoc) {
            case "left":
                subString = string.substr(-subStringLength);
                if (trimWS) {
                    subString = subString.trim();
                }
                subString = ellipsis + subString;
                break;
            case "right":
                subString = string.substr(0, subStringLength);
                if (trimWS) {
                    subString = subString.trim();
                }
                subString += ellipsis;
                break;
            case "center":
                const leftStringLength = Math.floor(subStringLength / 2);
                const rightStringLength = Math.ceil(subStringLength / 2);
                const leftString = string.substr(0, leftStringLength);
                const rightString = string.substr(-rightStringLength);
                if (trimWS) {
                    leftString = leftString.trim();
                    rightString = rightString.trim();
                }
                subString = leftString + ellipsis + rightString;
                break;
            case "sides":
                const leftTrimLength = Math.floor((string.length - subStringLength) / 2);
                subString = string.substr(leftTrimLength, subStringLength);
                if (trimWS) {
                    subString = subString.trim();
                }
                subString = ellipsis + subString + ellipsis;
                break;
        }
    }
    return subString;
}

