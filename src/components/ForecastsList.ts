import {Forecast, ForecastGroup} from "../lib/Forecast";
import {ForecastTile} from "./ForecastTile";

const cx = {
    wrapper: 'forecasts-list',
    date: 'forecasts-list__date',
    tilesContainer: 'forecasts-list__tiles'
};

export class ForecastsList {
    private readonly group: ForecastGroup;

    constructor(group: ForecastGroup) {
        this.group = group;
    }

    private getDatePrefix(forDay: number) {
        const today: number = new Date(Date.now()).getDate();
        const tomorrow: number = new Date(Date.now()).getDate() + 1;
        if (forDay === today)
            return 'Today, ';
        if (forDay === tomorrow)
            return 'Tomorrow, ';
        return ''
    }

    create() {
        const art: HTMLElement = document.createElement('article');
        art.classList.add(cx.wrapper);

        const date: HTMLElement = document.createElement('h2');
        date.classList.add(cx.date);

        const ff: Forecast = this.group.getForecasts()[0];
        const firstDayForecastDateDay: number = ff.getLocalDate().getDate();

        date.innerText = this.getDatePrefix(firstDayForecastDateDay) + ff.getLocalDate().toLocaleDateString();
        art.appendChild(date);

        const tiles: HTMLElement = document.createElement('section');
        tiles.classList.add(cx.tilesContainer);

        for (let f of this.group.getForecasts())
            tiles.appendChild(new ForecastTile(f).create());

        art.appendChild(tiles);
        return art
    }
}