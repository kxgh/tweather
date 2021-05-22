import {City} from './City';

export enum TempUnit {
    K = 'K', C = 'C', F = 'F', AUTO = 'AUTO'
}

export interface ForeCastData {
    utcTime: number;
    temp: number;
    description: string;
    icon: string;
    timezone: number;
    country: string;
    city: string;
    wind: number;
}

export interface Forecast extends ForeCastData {
    getTemp(unit?: TempUnit): string;

    getUtcTime(): number;

    getLocalTime(): number;

    getLocalDate(): Date;

    getDescription(): string;

    getTimeZone(): number;

    getIcon(): string;

    getCountry(): string;

    getCity(): string;

    getWind(): number;
}

export interface ForecastGroup {
    getCity(): string;

    getCountry(): string;

    getTimezone(): string;

    getForecasts(): Array<Forecast>;
}

export interface ForecastsProvider {
    provideByCityId(cityId: number | string): Promise<Array<ForecastGroup>>;

    provideByCoords(lat: number | string, lon: number | string): Promise<Array<ForecastGroup>>;
}

export interface ForecastActionListener {
    onForecastByCityId(city: City): any | Promise<any>;

    onForecastByCoords(lat: string, lon: string, city?: City): any | Promise<any>;
}
