import axios from "axios";
import {Forecast, ForeCastData, ForecastReport} from "./Forecast";
import {DayForecast} from "./DayForecast";

export interface ForecastsProvider {
    provide(cityId: number | string): Promise<Array<DayForecast>>
}

export class OWMForecastsProvider implements ForecastsProvider{
    private readonly url: string;

    constructor(url: string) {
        this.url = 'http://api.openweathermap.org/data/2.5/forecast?id=3069011&appid=314da1c8c5968a0ce3c6c2d12e90bce5';
    }

    private assignRecsToDays(recs: Array<ForecastReport>): Array<DayForecast> {
        const days: Array<DayForecast> = [];
        for (let rec of recs) {
            const recDay: number = new Date(rec.timestamp).getDate();
            let fd: DayForecast | null = days.filter(d => d.forDay === recDay)[0];
            if (!fd) {
                fd = new DayForecast(recDay);
                days.push(fd);
            }
            fd.insertForecast(rec);
        }
        return days
    }

    async provide(cityId: number | string): Promise<Array<DayForecast>> {
        try {
            cityId += '';
            console.log(cityId);
            const resp: any = (await axios.get('sampleWeather.json')).data;
            //const resp: any = (await axios.get(this.url)).data;
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

            return this.assignRecsToDays(recs)
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}