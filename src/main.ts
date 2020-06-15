import {CitiesProvider} from "./lib/City";
import {PackedCitiesProvider} from "./lib/PackedCitiesProvider";
import {ForecastsProvider} from "./lib/Forecast";
import {OWMForecastsProvider} from "./lib/OWMForecastsProvider";
import {ListCityChooser} from "./components/ListCityChooser";
import {CountryFlagsIOFlagProvider} from "./lib/CountryFlagsIOFlagURLProvider";
import {ForecastDisplayer} from "./lib/ForecastDisplayer";
import './styles/global.css';

const citiesProvider: CitiesProvider = new PackedCitiesProvider();
const forecastProvider: ForecastsProvider = new OWMForecastsProvider();

citiesProvider.preobtain().then(r => {
    console.log('done obtaining');
});

const searchBar: HTMLInputElement = document.getElementById('search-bar') as HTMLInputElement;
const searchBarParent: HTMLElement = searchBar.parentElement!;
const mainForecastsDisplay = document.getElementById('forecasts-display') as HTMLElement;

const forecastDisplayer: ForecastDisplayer = new ForecastDisplayer(forecastProvider, mainForecastsDisplay);
const cityChooser: ListCityChooser = new ListCityChooser(searchBar, citiesProvider);
cityChooser.setFlagProvider(new CountryFlagsIOFlagProvider('small'));
searchBarParent.appendChild(cityChooser.create());
//cityChooser.attach(searchBarParent);
cityChooser.addConsumer(forecastDisplayer);
