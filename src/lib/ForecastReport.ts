import {Forecast, ForeCastData, TempUnit} from "./Forecast";

export class ForecastReport implements Forecast {
    readonly temp: number = 0;
    readonly utcTime: number = 0;
    readonly description: string = '';
    readonly icon: string = '';
    readonly timezone: number;
    readonly country: string;
    readonly city: string;
    readonly wind: number;

    constructor(data: ForeCastData) {
        this.temp = data.temp;
        // to millis timestamp
        this.utcTime = data.utcTime > 999000000000 ? data.utcTime : 1000 * data.utcTime;
        this.timezone = data.timezone * 1000;
        this.description = data.description;
        this.icon = data.icon;
        this.country = data.country.toLowerCase();
        this.city = data.city;
        this.wind = data.wind;
    }

    getTimeZone(): number {
        return this.timezone;
    }

    getTemp(unit: TempUnit): string {
        if (window.location.search.toLowerCase().indexOf('tempunit=c') >= 0) // TODO
            unit = TempUnit.C;
        else if (!unit || unit === TempUnit.AUTO)
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

    getLocalDate(): Date {
        return new Date(this.getLocalTime() + new Date().getTimezoneOffset() * 60 * 1000)
    }

    getLocalTime(): number {
        return this.utcTime + this.timezone;
    }

    getUtcTime(): number {
        return this.utcTime;
    }

    getDescription(): string {
        return this.description;
    }

    getIcon(): string {
        return this.icon;
    }

    getCity(): string {
        return this.city;
    }

    getCountry(): string {
        return this.country;
    }

    getWind(): number {
        return this.wind;
    }
}