import {CitiesProvider} from "./lib/City";
import {CitySearchBar} from "./components/CitySearchBar";
import {PackedCitiesProvider} from "./lib/PackedCitiesProvider";
import {ForecastsProvider} from "./lib/Forecast";
import {OWMForecastsProvider} from "./lib/OWMForecastsProvider";
import {ListCityChooser} from "./components/ListCityChooser";
import {ForecastDisplayer} from "./lib/ForecastDisplayer";
import './styles/global.css';

const citiesProvider: CitiesProvider = new PackedCitiesProvider(true);
const forecastProvider: ForecastsProvider = new OWMForecastsProvider();

citiesProvider.preobtain().then(r => {
    console.log('done obtaining');
});

const searchBar: HTMLInputElement = new CitySearchBar().create();// document.getElementById('search-bar') as HTMLInputElement;
const searchBarParent: HTMLElement = document.getElementById('search-form')!;
const mainForecastsDisplay = document.getElementById('forecasts-display') as HTMLElement;

const forecastDisplayer: ForecastDisplayer = new ForecastDisplayer(forecastProvider, mainForecastsDisplay);
const cityChooser: ListCityChooser = new ListCityChooser(searchBar, citiesProvider);
searchBarParent.appendChild(searchBar);
searchBarParent.appendChild(cityChooser.create());
cityChooser.addListener(forecastDisplayer);

const displayByGeoLoc = () => {
    try {
        navigator.geolocation.getCurrentPosition(async ({coords}) => {
            await forecastDisplayer.onForecastByCoords('' + coords.latitude, '' + coords.longitude);
            setImmediate(()=>{
                window.scrollTo(0,0);
            })
        }, e => {
            console.warn(e);
        })
    } catch (e) {
        console.warn(e);
    }
};
displayByGeoLoc();
