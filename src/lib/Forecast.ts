import {ForecastReport} from "./ForecastReport";

export enum TempUnit {
    K = "K", C = "C", F = "F", AUTO = "AUTO"
}

export interface ForeCastData {
    timestamp: number;
    timeUtc: string;
    temp: number;
    humidity: number;
    description: string;
    icon: string;
}

export interface Forecast extends ForeCastData {
    getTemp(unit?: TempUnit): string;

    getHumidity(): string;

    getTimestamp(): number;

    getLocaleDate(): string;

    getLocaleDateTime(): string;

    getDescription(): string;

    getIcon(): string;
}

export interface ForecastGroup {
    getCity(): string;

    getCountry(): string;

    getForecasts(): Array<Forecast>;
}

export interface ForecastsProvider {
    provideByCityId(cityId: number | string): Promise<Array<ForecastGroup>>;

    provideByCoords(lat: number | string, lon: number | string): Promise<Array<ForecastGroup>>;
}

export interface ForecastActionListener {
    onForecastByCityId(cityId: string): any | Promise<any>;

    onForecastByCoords(lat: string, lon: string): any | Promise<any>;
}