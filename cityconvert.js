const file = require('./city.list.json');
const fs = require('fs');

const SEP = ';';
const NL = String.fromCharCode(10);

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        let x = a[key];
        let y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
    });
}

/*const cm = (() => {
    const m = new Map();
    let counter = -9;
    return {
        translate(countryCode) {
            const num = m.get(countryCode);
            if (num || num === 0)
                return num;
            m.set(countryCode, counter);
            return counter++
        },
        toObj() {
            const entries = [...m.entries()];
            const result = {};
            entries.forEach(e => {
                result[e[1]] = e[0];
            });
            console.log(result)
            return result
        }
    }
})();*/

const toStringLine = (id, name, country) => {
    return [id, name, country].join(SEP);
};

let res = sortByKey(file.map(e => ({id: e.id, name: e.name, country: e.country})), 'name');
res = res.map(e => toStringLine(e.id, e.name, e.country));
const finalString = res.join(NL);
fs.writeFileSync('./cities.json', JSON.stringify([finalString]));
