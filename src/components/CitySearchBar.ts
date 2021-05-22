const cx = {
    mainClass: 'city-search-bar'
};

export class CitySearchBar {
    create(): HTMLInputElement {
        const el: HTMLInputElement = document.createElement('input');
        el.name = 'location';
        el.type = 'text';
        el.placeholder = 'Search for a location...';
        el.autocomplete = 'off';
        el.classList.add(cx.mainClass);
        return el;
    }
}