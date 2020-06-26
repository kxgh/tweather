import axios from "axios";
import {Forecast, ForecastGroup, ForecastsProvider} from "./Forecast";
import {ForecastReport} from "./ForecastReport";
import {DayForecast} from "./DayForecast";

const API_KEY: string = '314da1c8c5968a0ce3c6c2d12e90bce5';

export class OWMForecastsProvider implements ForecastsProvider {

    constructor() {
    }

    private getCityIdUrl(cityId: string | number) {
        return `https://api.openweathermap.org/data/2.5/forecast?id=${'' + cityId}&appid=${API_KEY}`;
    }

    private getCoordsUrl(lat: number | string, lon: number | string) {
        const lt: string = 'lat=' + lat;
        const ln: string = 'lon=' + lon;
        return `https://api.openweathermap.org/data/2.5/forecast?${lt}&${ln}&appid=${API_KEY}`;
    }

    private getIconUrl(icon: string) {
        return `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }

    private assignRecsToDays(recs: Array<Forecast>): Array<ForecastGroup> {
        const days: Array<DayForecast> = [];
        for (let rec of recs) {
            const recDay: number = rec.getLocalDate().getDate();
            let fd: DayForecast | null = days.filter(d => d.forDay === recDay)[0];
            if (!fd) {
                fd = new DayForecast(recDay, rec.getCity(), rec.getCountry());
                days.push(fd);
            }
            fd.insertForecast(rec);
        }
        return days
    }

    private rawListToForecasts(rl: Array<any>, city: string, country: string, timezone: number): Array<Forecast> {
        return rl.map((f: any) =>
            new ForecastReport({
                utcTime: f.dt,
                city,
                country,
                timezone,
                temp: f.main.temp,
                icon: this.getIconUrl('' + f.weather[0].icon),
                description: f.weather[0].description
            })
        );
    }

    async provideByCityId(cityId: number | string): Promise<Array<ForecastGroup>> {
        try {
            //const resp: any = (await axios.get('sampleWeather.json')).data;
            const resp: any = (await axios.get(this.getCityIdUrl(cityId))).data;
            const recs: Array<Forecast> = this.rawListToForecasts(resp.list,
                resp.city.name, resp.city.country, resp.city.timezone);
            return this.assignRecsToDays(recs)
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async provideByCoords(lat: number | string, lon: number | string): Promise<Array<ForecastGroup>> {
        try {
            const resp: any = (await axios.get(this.getCoordsUrl(lat, lon))).data;
            const recs: Array<Forecast> = this.rawListToForecasts(resp.list,
                resp.city.name, resp.city.country, resp.city.timezone);
            return this.assignRecsToDays(recs);
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}