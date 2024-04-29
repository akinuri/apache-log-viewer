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
        if (columnName.includes(".")) {
            return getObjProp(item, columnName);
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