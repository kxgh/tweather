export interface City {
    id: string;
    name: string;
    country: string;
}

export interface CitiesProvider {
    preobtain(): Promise<boolean>;

    provide(prefix: string): Array<City>;
}
