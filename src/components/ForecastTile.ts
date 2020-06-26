import {Forecast, TempUnit} from "../lib/Forecast";

const cx = {
    container: 'forecast-tile',
    time: 'forecast-tile__time',
    temp: 'forecast-tile__temp',
    humidity: 'forecast-tile__humidity',
    desc: 'forecast-tile__desc',
    icon: 'forecast-tile__icon',
    text: 'forecast-title__text'
};

export class ForecastTile {
    private readonly forecast: Forecast;

    constructor(forecast: Forecast) {
        this.forecast = forecast;
    }

    private skipSeconds(dateString: string): string {
        return dateString.replace(/(\d+)(:\d\d)(:\d\d)(.*)/, '$1$2$4');
    }

    create(): HTMLElement {
        const f: Forecast = this.forecast;

        const art = document.createElement('article');
        art.classList.add(cx.container);

        const apd = (tag: string, clas: string, txt: string) => {
            const el: HTMLElement = document.createElement(tag);
            el.classList.add(clas);
            if (tag === 'p')
                el.classList.add(cx.text);
            txt && (el.innerText = txt);
            art.appendChild(el);
            return el
        };

        (apd('img', cx.icon, '') as HTMLImageElement).src = f.getIcon();
        apd('p', cx.time, this.skipSeconds(f.getLocalDate().toLocaleTimeString()));
        apd('p', cx.temp, f.getTemp(TempUnit.AUTO));
        apd('p', cx.desc, f.getDescription() || '');

        return art
    }
}