import {CityConsumer} from "./City";
import {ForecastsProvider} from "./Forecast";
import {ForecastGroup} from "./Forecast";
import {ForecastsHeader} from "../components/ForecastsHeader";
import {ForecastsList} from "../components/ForecastsList";

export class ForecastDisplayer implements CityConsumer {
    private readonly forecastsProvider: ForecastsProvider;
    private readonly main: HTMLElement;

    constructor(forecastsProvider: ForecastsProvider, mainForecastsDisplay: HTMLElement) {
        this.forecastsProvider = forecastsProvider;
        this.main = mainForecastsDisplay;
    }

    async consume(cityId: string): Promise<void> {
        this.clean();
        const group: Array<ForecastGroup> = await this.forecastsProvider.provide(cityId);
        this.rebuild(group);
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

    private rebuild(group: Array<ForecastGroup>) {
        if (!group.length)
            return;
        this.clean();
        const frag: DocumentFragment = document.createDocumentFragment();
        this.buildHeader(frag, group[0].getCity());
        for (let g of group) {
            this.buildGroup(frag, g);
        }
        //this.buildGroup(frag, group[0])

        this.main.appendChild(frag);
    }

}