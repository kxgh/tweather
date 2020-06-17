import {ForecastActionListener} from "./Forecast";
import {City, RecentCitiesProvider} from "./City";
import {RecentCitiesBar} from "../components/RecentCitiesBar";

interface StoredCity extends City {
    lastAccess: number;
}

const MAX_RECENTS: number = 5;

export class RecentCities implements ForecastActionListener, RecentCitiesProvider {

    private readonly isUsingStorage: boolean;
    private current: Array<StoredCity> = [];
    private bar: RecentCitiesBar | null = null;

    provide(): Array<City> {
        return this.current.map(sc => ({...sc}));
    }

    constructor(allowStorage: boolean) {
        this.isUsingStorage = allowStorage && navigator.cookieEnabled;
        if (this.isUsingStorage) {
            this.current = this.readFromStorage();
            console.log(this.provide());
        }
    }

    private setCurrent(to: Array<StoredCity>) {
        const res: Array<StoredCity> = [];
        const includedCities: Array<string> = [];
        for (let sc of to) {
            if (!includedCities.includes(sc.name)) {
                res.push(sc);
                includedCities.push(sc.name);
            }
        }
        this.current = res.slice(0, MAX_RECENTS);
    }

    private saveToStorage(data: string) {
        try {
            document.cookie = data;
            console.debug(`Stored recent cities as cookie`)
        } catch (e) {
            console.warn(`Failed to store recent cities as cookie:`);
            console.warn(e);
        }
    }

    private readFromStorage(): Array<StoredCity> {
        try {
            const obtained: any = JSON.parse(document.cookie);
            if (!Array.isArray(obtained)) {
                this.saveToStorage(JSON.stringify([]));
                return [];
            } else return (obtained as Array<StoredCity>);
        } catch (e) {
            console.warn(e);
            // on parsing error clear the storage
            this.saveToStorage(JSON.stringify([]));
            return [];
        }
    }

    onForecastByCityId(city: City): any | Promise<any> {
        if (!this.isUsingStorage)
            return;
        const newStored: StoredCity = {...city, lastAccess: Date.now()};
        this.setCurrent(this.sortByAccessTime([newStored].concat(this.current)));
        this.saveToStorage(JSON.stringify(this.current));
        if(this.bar){
            this.bar.updateList();
        }else{
            console.warn('Recent cities updated but no associated element to update')
        }
    }

    onForecastByCoords(lat: string, lon: string, city?: City): any | Promise<any> {
        // ignore
    }

    setRecentCitiesBar(bar: RecentCitiesBar) {
        this.bar = bar;
    }

    private sortByAccessTime(cities: Array<StoredCity>): Array<StoredCity> {
        return cities.sort(function (a, b) {
            let x = a.lastAccess;
            let y = b.lastAccess;
            return ((x > y) ? -1 : ((x < y) ? 1 : 0))
        });
    }

}