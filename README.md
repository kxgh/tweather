# tweather


[LIVE DEMO HERE](https://s.ics.upjs.sk/~kvrastiak/tweather/)

## The task

The task was to create a simple web app which displays weather forecast for five upcoming days.

Requirements:

* client side/frontend only
* at least temperatures have to be displayed
* user picks a city using input field with autocomplete
* single page app
* no 3rd party libraries like jQuery, React...
* data source: openweathermap
* dev process on git
* this README describing the app and its inner structure

## Components

This section describes used components. A component is a Typescript file with its styles stored in 
an equally named SCSS file in components folder.

#### CitySearchBar

Simple search bar, `<input>` element. Has to be paired with `ListCityChooser` for the desired autocompletion feature.

#### ForecastChartistOverviewGraph

A component drawing an SVG graph using *Chartist.js* library. The graph is a overview of the upcoming 5 days.
The Y-axis labels denote temperatures in Celsius, or Fahrenheit if your browser's locale is in en-US locale.
The X-axis labels mark the beginning of the plotted days.

#### ForecastsHeader

Forecasts header component. Displays current city and the time zone of that city as a shift from UTC.
User can click this header to return to the top of the page.

#### ForecastsList

Displays a group of forecasts (day forecasts) and adds title that consists of date for the forecast group.
Today's and tomorrow's date are named respectfully.

#### ForecastTile

A forecast unit. Displays a single 3 hour forecast consisting of the temperature in degrees, forecast **local**
time, weather description and an appropriate weather icon. All of the mentioned data comes from
*www.openweathermap.org*.
The icon is restyled using CSS properties to match the application's theme color.
 
#### ListCityChooser

A user picks forecast city by typing into CitySearchBar, while this component reacts to user's input and offers 
cities which the user can choose from. Cities are matched by **testing for prefix**. If user's input matches 
city's first letters, it will get included in the autocomplete results. The **exception** to this is user's
input shorter than 3 characters: in this case, the autocomplete looks for **exact match**. A user can choose
from the autocompletion list by clicking on the desired item, or by using up and down arrow keys, page up, page down
keys. Flags are taken from *www.countryflags.io*. Cities are taken from *www.openweathermap.org*.

#### RecentCitiesBar

A user can pick from up to 5 recently chosen cities. The cities are ordered from newest to oldest. In case
more than 5 cities are searched, the oldest one gets removed from the list. The recent cities are stored as a JSON 
in a cookie.
 

## Inner structure

This section describes some of the implementation details.

#### City.ts

City structure and logic interface. Exports the following interfaces:

* `City` generic city (or any location) structure. Has 3 properties:
  * `id: string`  city id - a several digit number. Interpreted as a string throughout the entire app
  * `name: string`  city/location name
  * `country: string`  country: 2 letter unique code
* `CitiesProvider` is passed to ListCityChooser component, provides cities for the autocompletion. Methods:
  * `preobtain(): Promise<boolean>` downloads the cities to be used for autocompletion. Returns true if successful
  * `provide(prefix: string): Array<City>` returns matching cities for the user's input `prefix`
* `RecentCitiesProvider` lists recently looked up cities
  * `provide(): Array<City>` returns an array of recent cities

#### Forecast.ts

Forecast structure and logic interface. Exports the following interfaces:

* `TempUnit` enum with temperature units `K`, `F`, `C` and `AUTO`. `AUTO` uses celsius except for en-us locale (F).
* `ForeCastData` forecast data structure
  * `utcTime: number` UTC timestamp of the forecast
  * `temp: number` temperature in Kelvin
  * `description: string` weather description (overcast clouds, light rain, etc.)
  * `icon: string` png icon for openweathermap.org/img/wn/
  * `timezone: number` shift from UTC in seconds
  * `country: string` forecast country code
  * `city: string` forecast city name
* `Forecast` logic for the previous interface. Extends `ForeCastData`.
  * `getTemp(unit?: TempUnit): string` gets temperature using `TempUnit` temperature unit. Uses `AUTO` if none provided.
  * `getUtcTime(): number` gets forecast timestamp in milliseconds
  * `getLocalTime(): number` gets local time of the forecast in browser's locale
  * `getLocalDate(): Date` gets local date of the forecast in browser's locale
  * `getDescription(): string` gets weather description
  * `getTimeZone(): number` gets timezone as a shift from UTC in **milliseconds**
  * `getIcon(): string` gets weather icon
  * `getCountry(): string` gets forecast country code
  * `getCity(): string` gets forecast city name 
* `ForecastGroup` a group of forecasts
  * `getCity(): string` gets the city of forecast group.
  * `getCountry(): string` gets the country code of forecast group.
  * `getTimezone(): string` gets formatted UTC shift for user
  * `getForecasts(): Array<Forecast>` gets forecast
* `ForecastsProvider` is passed to the main forecast displayer. Downloads the forecasts for a user chosen city.   
  * `provideByCityId(cityId: number | string): Promise<Array<ForecastGroup>>` uses `cityId` to get forecasts
  * `provideByCoords(lat: number | string, lon: number | string): Promise<Array<ForecastGroup>>` uses coordinates to get
  forecasts
* `ForecastActionListener` listens for user's request
  * `onForecastByCityId(city: City): any | Promise<any>` user requested forecast by `city` id
  * `onForecastByCoords(lat: string, lon: string, city?: City): any | Promise<any>` user requested forecast by
  coordinates. `city` passed is optional
  
#### DayForecast.ts

Implementation of `ForecastGroup`. Only allows forecasts to be inserted if they are forecasting the same day.
The day is a date number.

#### ForecastDisplayer.ts

Implements `ForecastActionListener`. Builds GUI using components as a reaction to mentioned actions.

#### ForecastReport.ts

`Forecast` implementation. 

#### RecentCities.ts

Implements `ForecastActionListener` and `RecentCitiesProvider`. Provides recently looked up cities
and listens to `onForecastByCityId` action: saves requested city into recents. The implementation
internally persists recents as a cookie.

#### OWMForecastsProvider.ts

`ForecastsProvider` implementation. Uses openweathermap REST API to get forecasts. 

#### cityconvert.js

Node.js script converting original JSON from `city.list.gz` into a packed structure. It filters redundancies and
keeps only required information (id, city name, country code). The resulting `cities.pack.json` is then
used statically in a project. The script prepares the JSON file for prefix search: alphabetically sorts city names,
while ignoring their capitalization and non-normalized form. So for example, words beginning
with letters c, C, č, Ć are close to eachother.

#### PackedCitiesProvider.ts

Implements `CitiesProvider`. Unpacks previously transformed cities list JSON and attempts to
store it on user's device using **localStorage** to reuse it for next time. This saves users from redownloading the
large file each time they enter the website. Letter-Index map is also built (and stored) to speed up the lookups. If
for any reason the data could not be stored (e.g. maximum quota reached, browser does not support it), the data
will still be used but will not persist. Expected taken up space is 4MB. The provider also stores version of the cities
file. If the script requires a higher version than the user has stored, the user's device will automatically discard the
data and redownload and store the data again. Cities autocomplete is not case sensitive and ignores diacritics. 

#### main.ts

Instantiates and sets up required classes to make the app work. Geolocates user's location and displays relevant
forecast. The location might differ slightly among browsers.

### Browser support

Works on all modern browsers. Poor browsers (IE) require Promise polyfill which is not present.

### Run instructions

Dependencies, as well as dev dependencies are listed in package.json.
```javascript
npm install
```
Will install them. The only exception is SASS, the project assumes it is installed globally.
For dev start enter separately:
```
npm run sass
rpn run start:dev
```

To build:
```
npm run build
```