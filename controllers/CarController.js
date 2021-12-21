const CarRent = require('../models/CarRent')
const {tariffRental, sale} = require('../constants/accounting')


class CarController {
    static getCalculatingCostOfCar =  (req, res) => {
        try {
            const {tariff, dateStart, dateEnd} = req.params
            const dayPrice = tariffRental[tariff]
            const date1 = new Date(dateStart);
            const date2 = new Date(dateEnd);
            const timeDiff = Math.abs(date2.getTime() - date1.getTime());
            const periodDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (periodDays >=31) {
                return res.status(400).json({mg: 'Максимальный срок аренды автомобиля 30 дней'})
            }
            const dateStartDay =  new Date(dateStart).getDay()
            if(dateStartDay === 6 || dateStartDay === 0) {
                return res.status(400).json({mg: 'Невозможно арендовать автомобиль в выходные дни'})
            }
            const saleValue = Object.values(sale).forEach((item, index) => {
                (item[0] < periodDays < item[1]) && Object.keys(sale)[index]
            })
            const price = periodDays * dayPrice * (100 - saleValue) / 100
            return res.status(200).json(price)
        } catch (e) {
            res.status(500).json({message:'invalid request'})
        }
    }

    static postCreateRent = async (req, res) => {
        try {
            const {modelAuto, stateNumber, VIN, dateStart, dateEnd,  tariff} = req.body;
            const dateStartDay = new Date(dateStart).getDay()
            if ( dateStartDay === 6 || dateStartDay === 0) {
                return res.status(400).json({mg: 'Невозможно арендовать автомобиль в выходные дни'})
            }
            console.log("sfdfdsf")
            const date1 = new Date(dateStart);
            const date2 = new Date(dateEnd);
            const timeDiff = Math.abs(date2.getTime() - date1.getTime());
            const periodDay = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (periodDay >= 31) {
                return res.status(400).json({mg: 'Максимальный срок аренды автомобиля 30 дней'})
            }
            console.log("sfdfdsf")
            const car = await CarRent.findOne({
                VIN
            });

            console.log("sfdfdsf")
            const breakBetweenRentals = lastRental.setDate(lastRental.getDate() + 3)
            console.log("sfdfdsf")
            if(breakBetweenRentals >= dateStart) {
                return res.status(400).json({mg: 'Минимальный промежуток времени после последней аренды - 3 дня'})
            }
            console.log("sfdfdsf")
            return res.status(200).json({modelAuto, stateNumber, VIN, dateStart, dateEnd, tariff})
        } catch (e) {
            res.status(500).json({mg: 'invalid request'})
        }
    }

    static getLoadingAllCars = async (req, res) => {
        try {
            const carsRent = CarRent.find({})
            const busyDays = []
            const rentDays = carsRent.map(item => item.length)
            const amountOfDays = rentDays.reduce((carsRent) => {
            })

            return res.status(200).json({mg: 'successfully'})
        } catch (e) {
            res.status(500).json({mg: 'invalid request'})
        }
    }

    static getLoadingOneCars = async (req, res) => {
        try {
            const {VIN} = req.params
            if (!VIN) {
                return res.status(400).json({message: ''})
            }
            const carsRent = await CarRent.find({VIN:{$in:[VIN]}})
            const busyDays = [];
            for (const rent in carsRent) {
                const rentDays = []
                for (const day in rentDays) {
                    rentDays.push(day);
                }
            }
            return res.status(200).json(busyDays)
        } catch (e) {
            res.status(500).json({mg: 'invalid request'})
        }

    }

    static addCar = async (req, res) => {
        try {
            const {modelAuto, stateNumber, VIN} = req.body;
            const checkCleaner = await CarRent.findOne({
                VIN
            });

            if (checkCleaner) {
                return res.status(401).json({message: 'vin already exist'})
            }
            let carObject = new CarRent({
                stateNumber,
                modelAuto,
                VIN
            })
            try {
                await  carObject.save()
                res.status(201).json({
                    cleaner: carObject
                })
            } catch (e) {
                console.log(e)
                res.status(500).json({message: 'oopppss'})
            }

        } catch (e) {
            res.status(500).json({mg: 'invalid request'})
        }

    }

}


module.exports = CarController
