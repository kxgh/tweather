import { Forecast, ForecastGroup } from '../lib/Forecast';
import { ForecastTile } from './ForecastTile';

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

    private getDayName(dayIndex: number): string {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday']
            .concat(['Thursday', 'Friday', 'Saturday']);
        return days.map(d => d + ', ')[dayIndex] || '';
    }

    private getDatePrefix(forDay: number, forDate: Date) {
        const now: number = Date.now();
        const today: number = new Date(now).getDate();
        const tomorrow: number = new Date(now + 1000 * 60 * 60 * 24).getDate();
        if (forDay === today)
            return 'Today, ';
        if (forDay === tomorrow)
            return 'Tomorrow, ';
        return this.getDayName(forDate.getDay());
    }

    create(): HTMLElement {
        const art: HTMLElement = document.createElement('article');
        art.classList.add(cx.wrapper);

        const date: HTMLElement = document.createElement('h2');
        date.classList.add(cx.date);

        const ff: Forecast = this.group.getForecasts()[0];
        const firstDayForecastDateDay: number = ff.getLocalDate().getDate();

        date.innerText = this.getDatePrefix(firstDayForecastDateDay, ff.getLocalDate())
            + ff.getLocalDate().toLocaleDateString();
        art.appendChild(date);

        const tiles: HTMLElement = document.createElement('section');
        tiles.classList.add(cx.tilesContainer);

        for (const f of this.group.getForecasts())
            tiles.appendChild(new ForecastTile(f).create());

        art.appendChild(tiles);
        return art;
    }
}