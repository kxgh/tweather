import {PackedCitiesProvider, CitiesProvider} from "./lib/CitiesProvider";
import {OWMForecastsProvider, ForecastsProvider} from "./lib/ForecastsProvider";
import './styles/global.css';

const citiesProvider: CitiesProvider = new PackedCitiesProvider();
const forecastProvider: ForecastsProvider = new OWMForecastsProvider('x');

citiesProvider.preobtain().then(r=>{
    console.log('done obtaining');
});

const searchBar: HTMLInputElement = document.getElementById('search-bar') as HTMLInputElement;
searchBar.onkeydown = (e)=>{
    if(e.key.toLowerCase() === 'enter'){
        e.preventDefault();
        console.log(citiesProvider.provide(searchBar.value))
    }
    console.log('yupi')
    //console.log(citiesProvider.provide(inp.value));
};


const btn = document.getElementById('xx') as HTMLButtonElement;
const btn2 = document.getElementById('xx2') as HTMLButtonElement;
const inp = document.getElementById('xy') as HTMLInputElement;
btn.onclick = ()=>{
    console.log(citiesProvider.provide(inp.value));

};
btn2.onclick = async ()=>{
    console.log(await forecastProvider.provide(43));
};

/*import {f} from "./dva";
import './style.css';
import './global.css';

const x: HTMLElement = document.getElementById('xx')! as HTMLElement;
console.log(x)
x.addEventListener('click',function () {
    console.log('ehhx x xx x ');
    f();
})

function component() {
    const element = document.createElement('div');

    element.innerHTML = 'ej ou lec gou';
    element.classList.add('hello');

    return element;
}*/

//document.body.appendChild(component());