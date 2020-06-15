import {ForecastReport} from "./ForecastReport";
import {ForecastGroup} from "./Forecast";

export class DayForecast implements ForecastGroup{
    readonly forDay: number;
    private readonly records: Array<ForecastReport>;
    private readonly forCountry: string;
    private readonly forCity: string;

    constructor(forDay: number, forCity: string, forCountry: string) {
        this.forDay = forDay;
        this.forCity = forCity;
        this.forCountry = forCountry;
        this.records = [];
    }

    insertForecast(forecastRecord: ForecastReport) {
        if (new Date(forecastRecord.timestamp).getDate() !== this.forDay)
            throw new Error('Inserting forecast record into a wrong day!');
        this.records.push(forecastRecord);
    }

    getForecasts(): Array<ForecastReport>{
        return this.records;
    }

    getCity(): string {
        return this.forCity;
    }

    getCountry(): string {
        return this.forCountry;
    }
}