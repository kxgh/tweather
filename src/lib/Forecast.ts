import {ForecastReport} from "./ForecastReport";

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
    getTemp(unit?: TempUnit): string;

    getHumidity(): string;

    getTimestamp(): number;

    getLocaleDate(): string;

    getLocaleDateTime(): string;
}

export interface ForecastGroup {
    getCity(): string;
    getCountry(): string;
    getForecasts(): Array<Forecast>;
}

export interface ForecastsProvider {
    provide(cityId: number | string): Promise<Array<ForecastGroup>>
}
