import {ForecastReport} from "./Forecast";

export class DayForecast {
    readonly forDay: number;
    private readonly records: Array<ForecastReport>;

    constructor(forDay: number) {
        this.forDay = forDay;
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
}