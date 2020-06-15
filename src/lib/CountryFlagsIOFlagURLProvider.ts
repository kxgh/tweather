import {FlagURL, FlagURLProvider} from "./FlagURL";


export class CountryFlagsIOFlagProvider implements FlagURLProvider {
    private readonly size: number;

    constructor(size: "small" | "medium" | "large" | 32 | 64) {
        this.size = (size === "medium" || size === "large" || size === 64) ? 64 : 32;
    }

    provide(country: string,): FlagURL {
        return {url: `http://www.countryflags.io/${country.toLowerCase()}/flat/${this.size}.png`};
    }
}
