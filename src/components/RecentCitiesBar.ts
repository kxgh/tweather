import {City, RecentCitiesProvider} from '../lib/City';
import {ForecastActionListener} from '../lib/Forecast';

const cx = {
    list: 'recent-cities-bar__list',
    head: 'recent-cities-bar__head',
    item: 'recent-cities-bar__list__item',
    wrapper: 'recent-cities-bar',
    elHidden: 'recent-cities-bar--hidden'
};

export class RecentCitiesBar {
    private readonly provider: RecentCitiesProvider;
    private readonly wrapper: HTMLElement;
    private readonly ul: HTMLUListElement;
    private readonly head: HTMLElement;
    private listeners: Array<ForecastActionListener> = [];

    constructor(provider: RecentCitiesProvider) {
        this.provider = provider;

        this.wrapper = document.createElement('div') as HTMLElement;
        this.wrapper.classList.add(cx.wrapper);

        this.head = document.createElement('a');
        this.head.classList.add(cx.head);
        this.head.innerText = 'Recent places';

        this.ul = document.createElement('ul') as HTMLUListElement;
        this.ul.classList.add(cx.list);

        this.wrapper.appendChild(this.head);
        this.wrapper.appendChild(this.ul);
    }

    addListener(listener: ForecastActionListener): void {
        this.listeners.push(listener);
    }

    updateList(): void {
        this.ul.innerHTML = '';
        const frag: DocumentFragment = document.createDocumentFragment();
        const carr: Array<City> = this.provider.provide();
        if (!carr.length) {
            this.wrapper.classList.add(cx.elHidden);
            return;
        } else this.wrapper.classList.remove(cx.elHidden);
        for (const city of carr) {
            const el = document.createElement('li');
            el.innerText = city.name;
            el.classList.add(cx.item);
            el.addEventListener('click', () => {
                for (const listener of this.listeners)
                    listener.onForecastByCityId(city);
            });
            frag.appendChild(el);
        }
        this.ul.appendChild(frag);
    }

    create(): HTMLElement {
        this.updateList();
        return this.wrapper;
    }
}