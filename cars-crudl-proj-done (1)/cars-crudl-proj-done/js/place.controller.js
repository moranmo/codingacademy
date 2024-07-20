//import { carService } from './services/car.service.js'
import { placeService } from './services/place.service.js'

window.store = store
window.onload = onInit
window.onInit = onInit
//window.onRemoveCar = onRemoveCar
window.onRemovePlace = onRemovePlace
//window.onUpdateCar = onUpdateCar
//window.onAddCar = onAddCar
//window.onReadCar = onReadCar
// window.onSetFilterBy = onSetFilterBy
// window.onSetSortBy = onSetSortBy
// window.onCloseModal = onCloseModal
//window.onNextPage = onNextPage

window.onhashchange = checkHash;

checkHash();

function checkHash() {
    var home = document.getElementById('home');

    //Check if the hash is empty
    if (window.location.hash.substring(1) == '') {
        home.style.display = 'block';
    } else {
        home.style.display = 'none';
    }
}


async function onInit() {


    // renderPlaces()

    try {
        await initMap()
        console.log('Map is ready')
    } catch (err) {
        console.log('Error: cannot init map')
    }
}

function initMap(lat = 29.557669, lng = 34.949795) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google-map available')
            gMap = new google.maps.Map(
                document.querySelector('.map'), {
                center: { lat, lng },
                zoom: 15
            })
            gMap.addListener('click', async ev => {
                alert
                const name = prompt('Place name?', 'Place 1')
                const lat = ev.latLng.lat()
                const lng = ev.latLng.lng()
                await placeService.addPlace(name, lat, lng, gMap.getZoom())
                renderPlaces()
            })
            console.log('Map!', gMap)
        })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    // TODO: Enter your API Key
    // const API_KEY = 'AIzaSyCaQVlcIeYewnFSmm3xkL2d3HHy9xhYbz4'
   const API_KEY = 'AIzaSyAyOoW9LmQMLVhneIibFteGnXHEsrMkTiM'

    const elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('GoogleMaps script failed to load')
    })
}




function store() {

    var inputEmail = document.getElementById("email")

    localStorage.setItem('user.email', inputEmail.value)

    var inputColor = document.getElementById("color")

    localStorage.setItem('user.txtColor', inputColor.value)

    var inputBirthdate = document.getElementById("birthdate")

    localStorage.setItem('user.birthDate', inputBirthdate.value)

    //updating live so it would work when pressing set button

    document.body.style.color = localStorage.getItem('user.txtColor')

    inputEmail.style.color = localStorage.getItem('user.txtColor')

    inputBirthdate.style.color = localStorage.getItem('user.txtColor')

    // inputBirthdate.style.color = localStorage.getItem('user.txtColor')
}


// Convert to ASYNC
async function renderCars() {
    // const cars = await carService.getCars()
    // console.log('cars', cars)

    // const strHtmls = cars.map(car => `
    //         <article class="car-preview">
    //             <button title="Delete car" class="btn-remove" onclick="onRemoveCar('${car.id}')">X</button>
    //             <h5>${car.vendor}</h5>
    //             <h6>Up to <span>${car.maxSpeed}</span> KMH</h6>
    //             <button onclick="onReadCar('${car.id}')">Details</button>
    //             <button onclick="onUpdateCar('${car.id}')">Update</button>
    //             <img title="Photo of ${car.vendor}" onerror="this.src='img/default.png'" src="img/${car.vendor}.png" alt="Car by ${car.vendor}">
    //         </article> 
    //       `)

    // console.log('strHtmls', strHtmls)
    // document.querySelector('.cars-container').innerHTML = strHtmls.join('')
}

// Convert to ASYNC
async function renderPlaces() {
    console.log(document.querySelector('.place-container'))
    const places = await placeService.getPlaces()
    console.log('places', places)

    // const strHtmls = places.map(place => `
    //         <article class="place-preview">            
    //             <button title="X" class="btn-remove" onclick="onRemovePlace('${place.id}')">X</button>
    //             <h5 style="margin: 0; display: inline;">${place.name}</h5>
    //         </article> 
    //       `)



    const strHtmls = places.map(place => `
            <li class="place-preview">            
              <button title="X" class="btn-remove" onclick="onRemovePlace('${place.id}')">X</button>
                <h5 style="margin: 0; display: inline;">${place.name}</h5>
            </li> 
          `)

    // console.log('strHtmls', strHtmls)
    document.querySelector('.place-container').innerHTML = strHtmls.join('')
}

// Try&Catch 
async function onAddCar() {
    try {
        const vendor = prompt('vendor?')
        if (vendor && vendor.length > 3) {
            const car = await carService.addCar(vendor)
            renderCars()
            flashMsg(`Car Added (id: ${car.id})`)
        }
    } catch (err) {
        console.log('Had issues with', err)
        flashMsg('Can not add car')
    } finally {
        console.log('Finally');
    }
}

async function onRemoveCar(carId) {
    console.log('reaching onRemoveCar function')
    try {
        await carService.removeCar(carId)
        renderCars()
        flashMsg('car removed!')
    } catch (err) {
        console.log('Had issues with', err)
        flashMsg('Can not remove car')
    }
}

async function onRemovePlace(placeId) {
    console.log('reaching onRemovePlace function')
    //  alert('reaching onRemovePlace function')
    // flashMsg('reaching onRemovePlace function')
    try {
        await placeService.removePlace(placeId)
        renderPlaces()
        // flashMsg('place removed!')
    } catch (err) {
        console.log('Had issues with', err)
        // flashMsg('Can not remove place')
    }
}

async function onUpdateCar(carId) {
    try {
        const car = await carService.getCarById(carId)
        const newSpeed = +prompt('Speed?', car.maxSpeed)
        if (newSpeed && car.maxSpeed !== newSpeed) {
            const car = await carService.updateCar(carId, newSpeed)
            renderCars()
            flashMsg(`Speed updated to: ${car.maxSpeed}`)
        }
    } catch (err) {
        console.log('Had issues with', err)
        flashMsg('Can not update car')
    }
}

async function onReadCar(carId) {
    try {
        const car = await carService.getCarById(carId)
        // const car = await carService.getCarById(carId).then((car) => {

        const elModal = document.querySelector('.modal')
        elModal.querySelector('h3').innerText = car.vendor
        elModal.querySelector('h4 span').innerText = car.maxSpeed
        elModal.querySelector('p').innerText = car.desc
        elModal.classList.add('open')
        // })
    } catch (err) {
        console.log('Had issues with', err)
        flashMsg('Can not read car')
    }
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onSetFilterBy(filterBy) {
    filterBy = carService.setCarFilter(filterBy)
    renderCars()

    const queryParams = `?vendor=${filterBy.vendor}&minSpeed=${filterBy.minSpeed}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    const filterBy = {
        vendor: queryParams.get('vendor') || '',
        minSpeed: +queryParams.get('minSpeed') || 0
    }

    if (!filterBy.vendor && !filterBy.minSpeed) return

    carService.setCarFilter(filterBy)
    document.querySelector('.filter-vendor-select').value = filterBy.vendor
    document.querySelector('.filter-speed-range').value = filterBy.minSpeed
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value
    const isDesc = document.querySelector('.sort-desc').checked

    if (!prop) return

    const sortBy = {}
    sortBy[prop] = (isDesc) ? -1 : 1

    console.log('sortBy', sortBy)

    // Shorter Syntax:
    // const sortBy = {
    //     [prop] : (isDesc)? -1 : 1
    // }

    carService.setCarSort(sortBy)
    renderCars()
}

async function onNextPage() {
    await carService.nextPage()
    renderCars()
}