export interface City {
    id: string;
    name: string;
    country: string;
}

export interface CitiesProvider {
    preobtain(): Promise<boolean>;

    provide(prefix: string): Array<City>;
}

export interface CityConsumer {
    consume(cityId: string): any | Promise<any>;
}