import {CitiesProvider, CityConsumer} from "../lib/City";
import {City} from "../lib/City";
import {FlagURLProvider} from "../lib/FlagURL";

const cx = {
    list: 'city-chooser',
    listShown: 'city-chooser--shown',
    listHidden: 'city-chooser--hidden',
    item: 'city-chooser__item',
    itemFlag: 'city-chooser__item__flag',
    itemBrowsed: 'city-chooser__item--browsed'
};

const cityIdKey = 'cityId';

export class ListCityChooser {
    private readonly input: HTMLInputElement;
    private readonly provider: CitiesProvider;
    private readonly consumers: Array<CityConsumer>;

    private ul: HTMLUListElement;
    private lis: Array<HTMLLIElement>;
    private browsed: number = -1;
    private pressTimeout: any;
    private pressDelay: number = 250;
    private created: boolean = false;
    private flagProvider: FlagURLProvider | null = null;

    constructor(forInput: HTMLInputElement, cityProvider: CitiesProvider) {
        this.input = forInput;
        this.provider = cityProvider;
        this.consumers = [];
        this.ul = document.createElement('ul');
        this.ul.classList.add(cx.list);
        this.ul.classList.add(cx.listHidden);
        this.lis = [];
        this.pressTimeout = setTimeout(() => {
        }, 0);
    }

    setFlagProvider(flagProvider: FlagURLProvider) {
        this.flagProvider = flagProvider;
    }

    setPressDelay(delay: number) {
        this.pressDelay = delay;
    }

    addConsumer(consumer: CityConsumer) {
        this.consumers.push(consumer);
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
                this.choose(cities[i].id, cities[i].name);
            });
            if (i === this.browsed)
                li.classList.add(cx.itemBrowsed);
            if (this.flagProvider) {
                const img: HTMLImageElement = document.createElement('img');
                img.src = this.flagProvider.provide(cities[i].country).url;
                img.classList.add(cx.itemFlag);
                li.appendChild(img);
            }

            frag.appendChild(li);
            this.lis.push(li);
        }
        this.ul.appendChild(frag);
    }

    private choose(cityId: string, cityName: string) {
        this.dissemble();
        this.input.blur();
        this.input.value = cityName;
        this.consumers.forEach(c => c.consume(cityId));
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
        if(this.created)
            return this.ul;
        this.created = true;
        const fkeys: Array<string> = ['arrowup', 'arrowdown', 'pageup', 'pagedown', 'home', 'end', 'enter', 'escape'];
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
        //target.appendChild(this.ul);
    }

    halt() {

    }
}