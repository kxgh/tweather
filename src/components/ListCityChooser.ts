import {CitiesProvider} from "../lib/City";
import {ForecastActionListener} from "../lib/Forecast";
import {City} from "../lib/City";

const cx = {
    list: 'city-chooser',
    listShown: 'city-chooser--shown',
    listHidden: 'city-chooser--hidden',
    item: 'city-chooser__item',
    itemFlag: 'city-chooser__item__flag',
    itemBrowsed: 'city-chooser__item--browsed'
};

export class ListCityChooser {
    private readonly input: HTMLInputElement;
    private readonly provider: CitiesProvider;
    private readonly listeners: Array<ForecastActionListener>;

    private ul: HTMLUListElement;
    private lis: Array<HTMLLIElement>;
    private browsed: number = -1;
    private pressTimeout: any;
    private pressDelay: number = 250;
    private created: boolean = false;

    constructor(forInput: HTMLInputElement, cityProvider: CitiesProvider) {
        this.input = forInput;
        this.provider = cityProvider;
        this.listeners = [];
        this.ul = document.createElement('ul');
        this.ul.classList.add(cx.list);
        this.ul.classList.add(cx.listHidden);
        this.lis = [];
        this.pressTimeout = setTimeout(() => {
        }, 0);
    }

    getCountryFlagUrl(country: string) {
        return `https://www.countryflags.io/${country.toLowerCase()}/flat/32.png`;
    }

    setPressDelay(delay: number) {
        this.pressDelay = delay;
    }

    addListener(listener: ForecastActionListener) {
        this.listeners.push(listener);
    }

    private dissemble() {
        this.ul.innerHTML = '';
        this.ul.classList.remove(cx.listShown);
        this.ul.classList.add(cx.listHidden);
        this.browsed = -1;
        this.lis = [];
    }

    private assemble(cities: Array<City>) {
        this.ul.classList.remove(cx.listHidden);
        this.ul.classList.add(cx.listShown);
        this.browsed = 0;
        this.lis = [];
        const frag: DocumentFragment = document.createDocumentFragment();
        for (let i = 0; i < cities.length; i++) {
            const li: HTMLLIElement = document.createElement('li');
            li.innerText = `${cities[i].name}, ${cities[i].country}`;
            li.classList.add(cx.item);
            li.addEventListener("click", (ev) => {
                this.choose(cities[i]);
            });
            if (i === this.browsed)
                li.classList.add(cx.itemBrowsed);
            const img: HTMLImageElement = document.createElement('img');
            img.src = this.getCountryFlagUrl(cities[i].country);
            img.classList.add(cx.itemFlag);
            li.appendChild(img);

            frag.appendChild(li);
            this.lis.push(li);
        }
        this.ul.appendChild(frag);
    }

    private choose(city: City) {
        this.dissemble();
        this.input.blur();
        this.input.value = city.name;
        this.listeners.forEach(c => c.onForecastByCityId(city));
    }

    private browse(by: number) {
        let current: HTMLLIElement | null = this.lis[this.browsed];
        if (current)
            current.classList.remove(cx.itemBrowsed);
        this.browsed += by;
        this.browsed >= this.lis.length && (this.browsed = 0);
        this.browsed < 0 && (this.browsed = this.lis.length - 1);
        current = this.lis[this.browsed];
        if (current)
            current.classList.add(cx.itemBrowsed);
    }

    private hint() {
        this.dissemble();
        clearTimeout(this.pressTimeout);
        this.pressTimeout = setTimeout(() => {
            const cities: Array<City> = this.provider.provide(this.input.value);
            if (cities.length)
                this.assemble(cities);
        }, Math.max(1, this.pressDelay));
    }

    create(): HTMLUListElement {
        if (this.created)
            return this.ul;
        this.created = true;
        const fkeys: Array<string> = ['arrowup', 'arrowdown', 'pageup', 'pagedown', 'enter', 'escape'];
        this.input.addEventListener("keydown", ev => {
            const key: string = ev.key.toLowerCase();
            fkeys.includes(key) && ev.preventDefault();
            if (key === 'enter') {
                const browsed: HTMLLIElement | null = this.lis[this.browsed];
                if (browsed)
                    browsed.click();
            }
        });
        this.input.addEventListener("keyup", ev => {
            const key: string = ev.key.toLowerCase();
            fkeys.includes(key) && ev.preventDefault();
            switch (key) {
                case fkeys[0]:
                    this.browse(-1);
                    break;
                case fkeys[1]:
                    this.browse(1);
                    break;
                case fkeys[2]:
                    this.browse(-5);
                    break;
                case fkeys[3]:
                    this.browse(5);
                    break;
                case 'escape':
                    this.dissemble();
                    break;
                case 'enter':
                    break;
                default:
                    this.hint();

            }
        });
        this.input.addEventListener("focusin", () => {
            this.hint();
        });
        return this.ul
    }
}