
const filteCarModel = (cars, model) => {
    return cars.filter(car => {
        return car.model.name.toLowerCase() === model.toLowerCase()
    })
}


module.exports = filteCarModel