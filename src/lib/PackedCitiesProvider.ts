import {CitiesProvider, City} from "./City";
import axios from "axios";

type CityRaw = [string, string, string];

enum StorageKey {
    CITIES_STORAGE_KEY = 'redWeatherCities',
    LIM_STORAGE_KEY = 'redWeatherLim',
    VERSION = 'redWeatherVersion'
}

const storageVersion: number = 6;

export class PackedCitiesProvider implements CitiesProvider {
    private readonly url: string = 'cities.pack.json';
    private readonly isUsingStorage: boolean;
    private cities: Array<CityRaw>;
    private letterIndexMap: { [key: string]: [number, number] } = {};

    constructor(allowStorage: boolean) {
        this.isUsingStorage = allowStorage && !!window.localStorage;
        this.cities = [];
    }

    private unpack(target: string): Array<CityRaw> {
        return target
            .split(String.fromCharCode(10))
            .map(row => {
                const rowArr = row.split(';');
                return [rowArr[0], rowArr[1], rowArr[2]];
            });
    }

    private saveToStorage(key: StorageKey, data: string) {
        if (this.isUsingStorage) {
            try {
                localStorage.setItem(key, data);
                console.debug(`Stored ${key} into local storage`)
            } catch (e) {
                console.warn(`Failed to store ${key} into local storage:`);
                console.warn(e);
            }
        }
    }

    private async fetchAndSet(): Promise<boolean> {
        try {
            const respString: string = (await axios.get(this.url)).data[0];
            this.saveToStorage(StorageKey.CITIES_STORAGE_KEY, respString);
            const cities: Array<any> = this.unpack(respString);
            console.debug(`Fetched ${cities.length} cities from ${this.url}`);
            this.cities = cities;
            return true
        } catch (e) {
            console.error(e);
            return false
        }

    }

    private storageVersionCheck(): void {
        if (!this.isUsingStorage)
            return;
        const v: number = parseInt('' + localStorage.getItem(StorageKey.VERSION)) || 0;
        if (v < storageVersion) {
            localStorage.clear();
            console.debug('Cleared storage');
            this.saveToStorage(StorageKey.VERSION, '' + storageVersion);
        }
    }

    async preobtain(): Promise<boolean> {
        this.storageVersionCheck();
        const fromStorage: string | null = this.isUsingStorage ?
            localStorage.getItem(StorageKey.CITIES_STORAGE_KEY) : null;
        if (fromStorage) {
            this.cities = this.unpack(fromStorage);
            console.debug(`Loaded ${this.cities.length} cities from localstorage`);
            return true
        } else
            return this.fetchAndSet();
    }

    private normalize(arg: string): string {
        // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        if (typeof arg.normalize === 'function')
            return arg.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return arg.toLowerCase();
    }

    private fillLetterIndexMap(): void {
        if (!Object.keys(this.letterIndexMap).length && this.cities.length) {
            if (this.isUsingStorage) {
                const storedMap: any = localStorage.getItem(StorageKey.LIM_STORAGE_KEY);
                if (storedMap) {
                    this.letterIndexMap = JSON.parse(storedMap);
                    console.debug('Loaded letter index map from storage');
                    return;
                }
            }
            let trailLetter = '\0';
            let trailStartIdx = 0;
            for (let i = 0; i < this.cities.length; i++) {
                const cname = this.normalize(this.cities[i][1]); // city name
                if (cname[0] !== trailLetter) { // on new trail
                    // end previous trail
                    i > 0 && (this.letterIndexMap[trailLetter] = [trailStartIdx, i - 1]);
                    // set up a new trail
                    trailLetter = cname[0];
                    trailStartIdx = i;
                }
            }
            this.letterIndexMap[trailLetter] = [trailStartIdx, this.cities.length - 1];
            if (this.isUsingStorage)
                this.saveToStorage(StorageKey.LIM_STORAGE_KEY, JSON.stringify(this.letterIndexMap))
        }
    }

    private getRelevantEntries(prefix: string, arr: Array<CityRaw>): Array<CityRaw> {
        if (!prefix || !this.cities.length)
            return arr;
        this.fillLetterIndexMap();
        const fl = this.normalize(prefix[0]);
        return arr.slice(this.letterIndexMap[fl][0], this.letterIndexMap[fl][1] + 1)
    }

    provide(prefix: string): Array<City> {
        const normPrefix: string = this.normalize(prefix.trim());
        if (prefix.length < 3) {
            const filterer = (c: CityRaw) => c[1].length === normPrefix.length &&
                this.normalize(c[1]) === normPrefix;
            return this.getRelevantEntries(prefix, this.cities).filter(filterer)
                .map(c => ({id: c[0], name: c[1], country: c[2]}))
        } else {
            const filterer = (c: CityRaw) => this.normalize(c[1]).startsWith(normPrefix);
            return this.getRelevantEntries(prefix, this.cities).filter(filterer)
                .map(c => ({id: c[0], name: c[1], country: c[2]}))
        }
    }
}
