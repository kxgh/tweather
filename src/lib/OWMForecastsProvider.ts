import axios from "axios";
import {ForecastsProvider} from "./Forecast";
import {ForecastGroup} from "./Forecast";
import {ForecastReport} from "./ForecastReport";
import {DayForecast} from "./DayForecast";

export class OWMForecastsProvider implements ForecastsProvider {

    constructor() {
    }

    private getCityIdUrl(cityId: string | number) {
        return `https://api.openweathermap.org/data/2.5/forecast?id=${'' + cityId}&appid=314da1c8c5968a0ce3c6c2d12e90bce5`;
    }

    private getCoordsUrl(lat: number | string, lon: number | string) {
        const lt: string = 'lat=' + lat;
        const ln: string = 'lon=' + lon;
        return `https://api.openweathermap.org/data/2.5/forecast?${lt}&${ln}&appid=314da1c8c5968a0ce3c6c2d12e90bce5`;
    }

    private getIconUrl(icon: string) {
        return `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }

    private assignRecsToDays(recs: Array<ForecastReport>, city: string, country: string): Array<ForecastGroup> {
        const days: Array<DayForecast> = [];
        for (let rec of recs) {
            const recDay: number = new Date(rec.timestamp).getDate();
            let fd: DayForecast | null = days.filter(d => d.forDay === recDay)[0];
            if (!fd) {
                fd = new DayForecast(recDay, city, country);
                days.push(fd);
            }
            fd.insertForecast(rec);
        }
        return days
    }

    private rawListToForecasts(rl: Array<any>): Array<ForecastReport> {
        return rl.map((f: any) =>
            new ForecastReport({
                timestamp: f.dt,
                timeUtc: f.dt_txt,
                temp: f.main.temp,
                humidity: f.main.humidity,
                icon: this.getIconUrl('' + f.weather[0].icon),
                description: f.weather[0].description
            })
        );
    }

    async provideByCityId(cityId: number | string): Promise<Array<ForecastGroup>> {
        try {
            //const resp: any = (await axios.get('sampleWeather.json')).data;
            const resp: any = (await axios.get(this.getCityIdUrl(cityId))).data;
            const recs: Array<ForecastReport> = this.rawListToForecasts(resp.list);
            return this.assignRecsToDays(recs, resp.city.name, resp.city.country)
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async provideByCoords(lat: number | string, lon: number | string): Promise<Array<ForecastGroup>> {
        try {
            const resp: any = (await axios.get(this.getCoordsUrl(lat, lon))).data;
            const recs: Array<ForecastReport> = this.rawListToForecasts(resp.list);
            return this.assignRecsToDays(recs, resp.city.name, resp.city.country)
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}