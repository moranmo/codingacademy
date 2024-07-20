import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const placeService = {
    getPlaces,
    removePlace,
    getPlaceById,
    _createPlaces,

}
const STORAGE_KEY = 'placeDB'

const gPlaces = ['Sydney', 'Florentin', 'Gaza', 'Tel Aviv']

// Create demo data
_createPlaces()

async function getPlaces() {

    let places = await storageService.query(STORAGE_KEY)
    console.log(places)

    return places
}
async function removePlace(placeId) {
    // alert('reaching removePlace')
    console.log(placeId)
    return await storageService.remove(STORAGE_KEY, placeId)

}
function addPlace(name, lat, lng, zoom) { }
function getPlaceById(placeId) { }

function _createPlace(name, lat, lng) {
    return {
        id: utilService.makeId(),
        name: name,
        lat: lat,
        lng: lng


        // maxSpeed: utilService.getRandomIntInclusive(50, 250),
        //desc: utilService.makeLorem()
    }
}

function _createPlaces() {
    let places = utilService.loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo data
    if (!places || !places.length) {
        // cars = []
        places = []
        for (let i = 0; i < 10; i++) {
            // var vendor = gVendors[utilService.getRandomIntInclusive(0, gVendors.length - 1)]
            // consloe.log(vendor)
            var place = gPlaces[utilService.getRandomIntInclusive(0, gPlaces.length - 1)]
            var lat = 32.1416
            var lng = 34.831213
            console.log(place)
            places.push(_createPlace(place, lat, lng))
        }
        console.log("places", places)

        utilService.saveToStorage(STORAGE_KEY, places)
    }
}
