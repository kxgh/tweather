import {City} from "./City";
import axios from "axios";

export interface CitiesProvider {
    preobtain(): Promise<boolean>;
    provide(prefix: string): Array<City>;
}

export class PackedCitiesProvider implements CitiesProvider{
    private readonly url: string = 'cities.pack.json';
    private readonly isUsingStorage: boolean;
    private readonly LOCALSTORAGE_KEY: string = 'twapp';
    private cities: Array<[string, string, string]>;

    constructor() {
        this.isUsingStorage = !!window.localStorage;
        this.cities = [];
    }

    private unpack(target: string): Array<[string, string, string]> {
        return target
            .split(String.fromCharCode(10))
            .map(row => {
                const rowArr = row.split(';');
                return [rowArr[0], rowArr[1], rowArr[2]];
            });
    }

    private storeFetched(data: string) {
        if (this.isUsingStorage) {
            try {
                localStorage.setItem(this.LOCALSTORAGE_KEY, data);
                console.debug('Stored cities into local storage')
            } catch (e) {
                console.warn('Failed to store cities into local storage');
            }
        }
    }

    private async fetchAndSet(): Promise<boolean> {
        try {
            const respString: string = (await axios.get(this.url)).data[0];
            this.storeFetched(respString);
            const cities: Array<any> = this.unpack(respString);
            console.debug(`Fetched ${cities.length} cities from ${this.url}`);
            this.cities = cities;
            return true
        } catch (e) {
            console.error(e);
            return false
        }
    }

    async preobtain(): Promise<boolean> {
        const fromStorage: string | null = this.isUsingStorage ?
            localStorage.getItem(this.LOCALSTORAGE_KEY) : null;
        if (fromStorage) {
            this.cities = this.unpack(fromStorage);
            console.debug(`Loaded ${this.cities.length} cities from localstorage`);
            return true
        } else
            return this.fetchAndSet();
    }

    provide(prefix: string): Array<City> {
        return this.cities.filter(c => c[1].toLowerCase().startsWith(prefix.toLowerCase()))
            .map(c => ({id: c[0], name: c[1], country: c[2]}))
    }
}
