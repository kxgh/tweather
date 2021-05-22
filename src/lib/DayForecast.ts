import {Forecast, ForecastGroup} from './Forecast';

export class DayForecast implements ForecastGroup {
    readonly forDay: number;
    private readonly records: Array<Forecast>;
    private readonly forCountry: string;
    private readonly forCity: string;

    constructor(forDay: number, forCity: string, forCountry: string) {
        this.forDay = forDay;
        this.forCity = forCity;
        this.forCountry = forCountry;
        this.records = [];
    }

    insertForecast(forecast: Forecast): void {
        if (forecast.getLocalDate().getDate() !== this.forDay)
            throw new Error('Inserting forecast record into a wrong day!');
        this.records.push(forecast);
    }

    public static formatTimezone(timezone: number): string {
        const sgn = timezone < 0 ? '-' : '+';
        const inMins = Math.floor(Math.abs(timezone / 1000) / 60);
        const hours = Math.floor(inMins / 60) || 0;
        const mins = (inMins % (hours * 60)) || 0;
        return `UTC${sgn}${hours > 9 ? hours : '0' + hours}:${mins > 9 ? mins : '0' + mins}`;
    }

    getTimezone(): string {
        if (!this.records.length)
            return '';
        return DayForecast.formatTimezone(this.records[0].getTimeZone());
    }

    getForecasts(): Array<Forecast> {
        return this.records;
    }

    getCity(): string {
        return this.forCity;
    }

    getCountry(): string {
        return this.forCountry;
    }
}