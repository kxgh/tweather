const cx = {
    container: 'forecasts__header',
    title: 'forecasts__header-title',
    desc: 'forecasts__header-desc'
};

export class ForecastsHeader {
    private readonly city: string;

    constructor(city: string) {
        this.city = city;
    }

    create(): HTMLElement {
        const h: HTMLElement = document.createElement('header');
        const t: HTMLElement = document.createElement('h2');
        const d: HTMLElement = document.createElement('p');
        h.classList.add(cx.container);
        t.classList.add(cx.title);
        d.classList.add(cx.desc);
        t.innerText = this.city;
        d.innerText = '5 day weather forecast';
        h.appendChild(t);
        h.appendChild(d);
        setImmediate(()=>{
            try {
                h.scrollIntoView({behavior: 'smooth'});
            } catch (e) {
                window.scrollTo(0, h.offsetTop);
            }
        });

        return h
    }

}