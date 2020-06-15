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
    
    create(): HTMLElement{
        const f: Forecast = this.forecast;
        
        const art = document.createElement('article');
        art.classList.add(cx.container);

        const apd = (tag:string, clas: string, txt: string)=>{
            const el: HTMLElement = document.createElement(tag);
            el.classList.add(clas);
            if(tag==='p')
                el.classList.add(cx.text);
            txt && (el.innerText = txt);
            art.appendChild(el);
            return el
        };

        (apd('img',cx.icon,'') as HTMLImageElement).src = `http://openweathermap.org/img/wn/${f.icon}@2x.png`;
        apd('p',cx.time,f.getLocaleDateTime());
        apd('p',cx.temp,f.getTemp(TempUnit.C));
        apd('p',cx.desc,f.description || '');

        return art
    }
}