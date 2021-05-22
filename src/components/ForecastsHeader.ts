const cx = {
    container: 'forecasts__header',
    title: 'forecasts__header-title',
    desc: 'forecasts__header-desc'
};

export class ForecastsHeader {
    private readonly city: string;
    private readonly timezone: string = '';

    constructor(city: string, timezone?: string) {
        this.city = city;
        timezone && (this.timezone = timezone);
    }

    create(): HTMLElement {
        const h: HTMLElement = document.createElement('header');
        const t: HTMLElement = document.createElement('h2');
        const d: HTMLElement = document.createElement('p');
        h.addEventListener('click', () => {
            window.scrollTo(0, 0);
        });
        h.classList.add(cx.container);
        t.classList.add(cx.title);
        d.classList.add(cx.desc);
        t.innerText = this.city;
        d.innerText = `5 day weather forecast${this.timezone ? ` (${this.timezone}) ` : ''}`;
        h.appendChild(t);
        h.appendChild(d);
        setImmediate(() => {
            try {
                h.scrollIntoView({behavior: 'smooth'});
            } catch (e) {
                window.scrollTo(0, h.offsetTop);
            }
        });

        return h;
    }

}