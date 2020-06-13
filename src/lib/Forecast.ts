export enum TempUnit {
    K = "K", C = "C", F = "F", AUTO = "AUTO"
}

export interface ForeCastData {
    timestamp: number;
    timeUtc: string;
    temp: number;
    humidity: number;
    description? : string;
    icon? : string;
}

export interface Forecast extends ForeCastData {
    getTemp(unit: TempUnit | null): string;

    getHumidity(): string;

    getTimestamp(): number;

    getLocaleDate(): string;

    getLocaleDateTime(): string;
}

export class ForecastReport implements Forecast {
    readonly humidity: number = 0;
    readonly temp: number = 0;
    readonly timeUtc: string = '';
    readonly timestamp: number = 0;
    readonly description: string = '';
    readonly icon: string = '';

    constructor(data: ForeCastData) {
        this.humidity = data.humidity;
        this.temp = data.temp;
        // millis timestamp
        this.timestamp = data.timestamp > 999000000000 ? data.timestamp : 1000 * data.timestamp;
        this.timeUtc = data.timeUtc;
        data.description && (this.description = data.description);
        data.icon && (this.icon = data.icon);
    }

    getTemp(unit: TempUnit | null): string {
        if (!unit || unit === TempUnit.AUTO)
            unit = navigator.language.toLowerCase() === 'en-us' ? TempUnit.F : TempUnit.C;
        switch (unit) {
            case TempUnit.C:
                return `${this.temp - 273.15}°C`;
            case TempUnit.F:
                return `${((this.temp - 273.15) * 1.8) + 32}°F`;
            default:
                return `${this.temp}°K`
        }
    }

    getHumidity(): string {
        return `${this.humidity}%`;
    }

    getLocaleDate(): string {
        return new Date(this.timestamp).toLocaleDateString(navigator.language);
    }

    getLocaleDateTime(): string {
        return new Date(this.timestamp).toLocaleTimeString(navigator.language);
    }

    getTimestamp(): number {
        return this.timestamp;
    }

}