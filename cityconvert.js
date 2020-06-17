const file = require('./city.list.json');
const fs = require('fs');

const SEP = ';';
const NL = String.fromCharCode(10);

const normalize = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const sortByKey = (array, key) => {
    return array.sort(function (a, b) {
        let x = normalize(a[key]);
        let y = normalize(b[key]);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
    });
};
const toStringLine = (id, name, country) => {
    return [id, name, country].join(SEP);
};


const mapAndFilterRedundancies = (content, target) => {
    const used = new Set();
    for (let entry of content) {
        const newEntry = {id: entry.id, name: entry.name, country: entry.country};
        const entryKey = entry.name + entry.country;
        if (!used.has(entryKey)) {
            used.add(entryKey);
            target.push(newEntry);
        }
    }
};

let res = [];
mapAndFilterRedundancies(file, res);
res = sortByKey(res, 'name');
res = res.map(e => toStringLine(e.id, e.name, e.country));
const finalString = res.join(NL);
fs.writeFileSync('./cities.pack.json', JSON.stringify([finalString]));
