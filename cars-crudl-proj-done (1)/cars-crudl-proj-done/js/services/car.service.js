import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'


export const carService = {
    getVendors,
    getCars,
    getPlaces,
    removeCar,
    removePlace,
    addCar,
    updateCar,
    getCarById,
    setCarFilter,
    setCarSort,
    nextPage,
    getCarCountBySpeedMap
}

//const STORAGE_KEY = 'carDB'
const STORAGE_KEY = 'placeDB'
const PAGE_SIZE = 4

const gVendors = ['audu', 'fiak', 'subali', 'mitsu']
var gFilterBy = { vendor: '', minSpeed: 0 }
var gSortBy = { maxSpeed: 1 }
var gPageIdx = 0

// Create demo data
_createCars()

function getVendors() {
    return gVendors
}

async function getCars() {
    let cars = await storageService.query(STORAGE_KEY)
    // Filter
    cars = cars.filter(car =>
        car.vendor.includes(gFilterBy.vendor) &&
        car.maxSpeed >= gFilterBy.minSpeed
    )

    // Sort
    if (gSortBy.maxSpeed !== undefined) {
        cars.sort((c1, c2) => (c1.maxSpeed - c2.maxSpeed) * gSortBy.maxSpeed)
    } else if (gSortBy.vendor !== undefined) {
        cars.sort((c1, c2) => c1.vendor.localeCompare(c2.vendor) * gSortBy.vendor)
    }

    // Pagination
    const startIdx = gPageIdx * PAGE_SIZE //1 * 4
    cars = cars.slice(startIdx, startIdx + PAGE_SIZE) //4 - 8

    return cars
}

async function getPlaces() {
    let places = await storageService.query(STORAGE_KEY)
    // Filter
    // cars = cars.filter(car =>
    //     car.vendor.includes(gFilterBy.vendor) &&
    //     car.maxSpeed >= gFilterBy.minSpeed
    // )

    // // Sort
    // if (gSortBy.maxSpeed !== undefined) {
    //     cars.sort((c1, c2) => (c1.maxSpeed - c2.maxSpeed) * gSortBy.maxSpeed)
    // } else if (gSortBy.vendor !== undefined) {
    //     cars.sort((c1, c2) => c1.vendor.localeCompare(c2.vendor) * gSortBy.vendor)
    // }

    // // Pagination
    // const startIdx = gPageIdx * PAGE_SIZE //1 * 4
    // cars = cars.slice(startIdx, startIdx + PAGE_SIZE) //4 - 8

    return places
}


async function removeCar(carId) {
    return await storageService.remove(STORAGE_KEY, carId)
}

async function removePlace(placeId) {
    return await storageService.remove(STORAGE_KEY, placeId)
}

async function addCar(vendor) {
    const car = _createCar(vendor)
    const addedCar = await storageService.post(STORAGE_KEY, car)
    return addedCar
}

async function getCarById(carId) {
    const car = await storageService.get(STORAGE_KEY, carId)
    return car
}

async function updateCar(carId, newSpeed) {
    const car = await getCarById(carId)
    car.maxSpeed = newSpeed
    const savedCar = await storageService.put(STORAGE_KEY, car)
    return savedCar
}

function setCarFilter(filterBy = {}) {
    if (filterBy.vendor !== undefined) gFilterBy.vendor = filterBy.vendor
    if (filterBy.minSpeed !== undefined) gFilterBy.minSpeed = filterBy.minSpeed
    return gFilterBy
}

function setCarSort(sortBy = {}) {
    gSortBy = sortBy
}

async function nextPage() {
    const cars = await storageService.query(STORAGE_KEY)
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= cars.length) {
        gPageIdx = 0
    }
}

async function getCarCountBySpeedMap() {
    const cars = await storageService.query(STORAGE_KEY)
    const carCountBySpeedMap = cars.reduce((map, car) => {
        if (car.maxSpeed < 120) map.slow++
        else if (car.maxSpeed < 200) map.normal++
        else map.fast++
        return map
    }, { slow: 0, normal: 0, fast: 0 })
    return carCountBySpeedMap
}




function _createCar(vendor) {
    return {
        id: utilService.makeId(),
        vendor,
        maxSpeed: utilService.getRandomIntInclusive(50, 250),
        desc: utilService.makeLorem()
    }
}

function _createCars() {
    let cars = utilService.loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo data
    if (!cars || !cars.length) {
        cars = []
        for (let i = 0; i < 21; i++) {
            var vendor = gVendors[utilService.getRandomIntInclusive(0, gVendors.length - 1)]
            cars.push(_createCar(vendor))
        }
    }
    utilService.saveToStorage(STORAGE_KEY, cars)
}