import {Forecast, ForecastGroup} from "../lib/Forecast";
import {ForecastTile} from "./ForecastTile";

const cx = {
    container: 'forecasts-list',
    date: 'forecasts-list__date'
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
            return 'Tomorrow, '
        return ''
    }

    create() {
        const art: HTMLElement = document.createElement('article');
        art.classList.add(cx.container);

        const date: HTMLElement = document.createElement('header');
        date.classList.add(cx.date);

        const firstDayForecastTimeDate = new Date(this.group.getForecasts()[0].getTimestamp());

        date.innerText = this.getDatePrefix(firstDayForecastTimeDate.getDate()) +
            firstDayForecastTimeDate.toLocaleDateString();
        art.appendChild(date);

        for (let f of this.group.getForecasts())
            art.appendChild(new ForecastTile(f).create());

        return art
    }
}