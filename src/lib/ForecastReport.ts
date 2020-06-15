import {Forecast, ForeCastData, TempUnit} from "./Forecast";

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

    getTemp(unit: TempUnit): string {
        if (!unit || unit === TempUnit.AUTO)
            unit = navigator.language.toLowerCase() === 'en-us' ? TempUnit.F : TempUnit.C;
        switch (unit) {
            case TempUnit.C:
                return `${Math.round(this.temp - 273.15)}°C`;
            case TempUnit.F:
                return `${Math.round(((this.temp - 273.15) * 1.8) + 32)}°F`;
            default:
                return `${Math.round(this.temp)}°K`
        }
    }

    getHumidity(): string {
        return `${this.humidity}%`;
    }

    getLocaleDate(): string {
        return new Date(this.timestamp).toLocaleDateString(navigator.language);
    }

    getLocaleDateTime(): string {
        let dt: string = new Date(this.timestamp).toLocaleTimeString(navigator.language);
        try {
            dt = dt.replace(/(\d+)(:\d\d)(:\d\d)(.*)/, '$1$2$4');
        } catch (e) {
            console.warn(e);
        }
        return dt;
    }

    getTimestamp(): number {
        return this.timestamp;
    }

    getDescription(): string {
        return this.description;
    }

    getIcon(): string {
        return this.icon;
    }

}