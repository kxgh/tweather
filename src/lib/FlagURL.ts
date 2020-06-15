export interface FlagURL {
    url: string;
}

export interface FlagURLProvider {
    provide(country: string): FlagURL;
}
