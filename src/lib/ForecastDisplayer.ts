import {ForecastGroup, ForecastActionListener, ForecastsProvider} from "./Forecast";
import {ForecastsHeader} from "../components/ForecastsHeader";
import {ForecastsList} from "../components/ForecastsList";

export class ForecastDisplayer implements ForecastActionListener {
    private readonly forecastsProvider: ForecastsProvider;
    private readonly main: HTMLElement;

    constructor(forecastsProvider: ForecastsProvider, mainForecastsDisplay: HTMLElement) {
        this.forecastsProvider = forecastsProvider;
        this.main = mainForecastsDisplay;
    }

    async onForecastByCityId(cityId: string): Promise<void> {
        this.clean();
        const group: Array<ForecastGroup> = await this.forecastsProvider.provideByCityId(cityId);
        //const group: Array<ForecastGroup> = await this.forecastsProvider.provideByCoords(49.07008, 17.4686208);
        this.rebuild(group);
    }

    async onForecastByCoords(lat: string, lon: string): Promise<void> {
        this.clean();
        const group: Array<ForecastGroup> = await this.forecastsProvider.provideByCoords(lat,lon);
        //const group: Array<ForecastGroup> = await this.forecastsProvider.provideByCoords(49.07008, 17.4686208);
        this.rebuild(group);
    }

    async consume(cityId: string): Promise<void> {
    }

    private clean() {
        this.main.innerHTML = '';
    }

    private buildHeader(frag: DocumentFragment, city: string) {
        frag.appendChild(new ForecastsHeader(city).create())
    }

    private buildGroup(frag: DocumentFragment, group: ForecastGroup) {
        frag.appendChild(new ForecastsList(group).create());
    }

    private rebuild(group: Array<ForecastGroup>): boolean {
        if (!group.length)
            return false;
        this.clean();
        const frag: DocumentFragment = document.createDocumentFragment();
        this.buildHeader(frag, group[0].getCity());
        for (let g of group) {
            this.buildGroup(frag, g);
        }
        //this.buildGroup(frag, group[0])

        this.main.appendChild(frag);
        return true;
    }

}