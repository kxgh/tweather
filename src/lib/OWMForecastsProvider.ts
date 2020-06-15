import axios from "axios";
import {ForecastsProvider} from "./Forecast";
import {ForecastGroup} from "./Forecast";
import {ForecastReport} from "./ForecastReport";
import {DayForecast} from "./DayForecast";

export class OWMForecastsProvider implements ForecastsProvider {

    constructor() {
    }

    private getUrl(cityId: string) {
        return `http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=314da1c8c5968a0ce3c6c2d12e90bce5`;
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

    async provide(cityId: number | string): Promise<Array<ForecastGroup>> {
        try {
            cityId += '';
            console.log(cityId);
            //const resp: any = (await axios.get('sampleWeather.json')).data;
            const resp: any = (await axios.get(this.getUrl('' + cityId))).data;
            const recs: Array<ForecastReport> = resp.list.map((f: any) =>
                new ForecastReport({
                    timestamp: f.dt,
                    timeUtc: f.dt_txt,
                    temp: f.main.temp,
                    humidity: f.main.humidity,
                    icon: f.weather[0].icon,
                    description: f.weather[0].description
                })
            );

            return this.assignRecsToDays(recs, resp.city.name, resp.city.country)
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}