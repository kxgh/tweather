import {ForecastActionListener, ForecastGroup, ForecastsProvider} from "./Forecast";
import {ForecastsHeader} from "../components/ForecastsHeader";
import {ForecastsList} from "../components/ForecastsList";
import {ForecastChartistOverviewGraph} from "../components/ForecastChartistOverviewGraph";
import {City} from "./City";

export class ForecastDisplayer implements ForecastActionListener {
    private readonly forecastsProvider: ForecastsProvider;
    private readonly main: HTMLElement;

    constructor(forecastsProvider: ForecastsProvider, mainForecastsDisplay: HTMLElement) {
        this.forecastsProvider = forecastsProvider;
        this.main = mainForecastsDisplay;
    }

    async onForecastByCityId(city: City): Promise<void> {
        this.clean();
        const group: Array<ForecastGroup> = await this.forecastsProvider.provideByCityId(city.id);
        this.rebuild(group);
    }

    async onForecastByCoords(lat: string, lon: string, city?: City): Promise<void> {
        this.clean();
        const group: Array<ForecastGroup> = await this.forecastsProvider.provideByCoords(lat, lon);
        this.rebuild(group);
    }

    private clean() {
        this.main.innerHTML = '';
    }

    private buildHeader(frag: DocumentFragment, city: string, timezone: string) {
        frag.appendChild(new ForecastsHeader(city, timezone).create())
    }

    private buildGraph(frag: DocumentFragment, groups: Array<ForecastGroup>) {
        frag.appendChild(new ForecastChartistOverviewGraph().create(groups));
    }

    private buildGroup(frag: DocumentFragment, group: ForecastGroup) {
        frag.appendChild(new ForecastsList(group).create());
    }

    private rebuild(groups: Array<ForecastGroup>): boolean {
        if (!groups.length)
            return false;
        this.clean();
        const frag: DocumentFragment = document.createDocumentFragment();
        this.buildHeader(frag, groups[0].getCity(), groups[0].getTimezone());
        this.buildGraph(frag, groups);
        for (let g of groups) {
            this.buildGroup(frag, g);
        }

        this.main.appendChild(frag);
        return true;
    }

}