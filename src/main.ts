import {CitiesProvider, RecentCitiesProvider} from "./lib/City";
import {CitySearchBar} from "./components/CitySearchBar";
import {PackedCitiesProvider} from "./lib/PackedCitiesProvider";
import {ForecastsProvider} from "./lib/Forecast";
import {OWMForecastsProvider} from "./lib/OWMForecastsProvider";
import {ListCityChooser} from "./components/ListCityChooser";
import {ForecastDisplayer} from "./lib/ForecastDisplayer";
import './styles/global.css';
import {RecentCities} from "./lib/RecentCities";
import {RecentCitiesBar} from "./components/RecentCitiesBar";

const PROVIDERS = (() => {
    const citiesProvider: CitiesProvider = new PackedCitiesProvider(true);
    const recentCitiesProvider: RecentCities = new RecentCities(true);
    const forecastProvider: ForecastsProvider = new OWMForecastsProvider();
    return {
        CITIES: citiesProvider,
        RECENTS: recentCitiesProvider,
        FORECASTS: forecastProvider
    }
})();

PROVIDERS.CITIES.preobtain().then(r => {
    console.log('Preobtained cities');
});

const rcb = new RecentCitiesBar(PROVIDERS.RECENTS);

const DOM_ELEMS = (() => {
    const searchBar: HTMLInputElement = new CitySearchBar().create();
    const headerNav: HTMLElement = document.getElementById('header-nav')!;
    const mainForecastsDisplay: HTMLElement = document.getElementById('forecasts-display') as HTMLElement;

    const recentCitiesBar: HTMLElement = rcb.create();
    return {
        SEARCH_BAR: searchBar,
        HEADER_NAV: headerNav,
        DISPLAY: mainForecastsDisplay,
        RECENTS_BAR: recentCitiesBar
    }
})();

const forecastDisplayer: ForecastDisplayer = new ForecastDisplayer(PROVIDERS.FORECASTS, DOM_ELEMS.DISPLAY);
const cityChooser: ListCityChooser = new ListCityChooser(DOM_ELEMS.SEARCH_BAR, PROVIDERS.CITIES);

DOM_ELEMS.HEADER_NAV.appendChild(DOM_ELEMS.SEARCH_BAR);
DOM_ELEMS.HEADER_NAV.appendChild(cityChooser.create());
DOM_ELEMS.HEADER_NAV.appendChild(DOM_ELEMS.RECENTS_BAR);

cityChooser.addListener(forecastDisplayer);
cityChooser.addListener(PROVIDERS.RECENTS);

rcb.addListener(forecastDisplayer);
PROVIDERS.RECENTS.setRecentCitiesBar(rcb);

const displayByGeoLoc = () => {
    try {
        navigator.geolocation.getCurrentPosition(async ({coords}) => {
            await forecastDisplayer.onForecastByCoords('' + coords.latitude, '' + coords.longitude);
            setImmediate(() => {
                window.scrollTo(0, 0);
            })
        }, e => {
            console.warn(e);
        })
    } catch (e) {
        console.warn(e);
    }
};
displayByGeoLoc();
