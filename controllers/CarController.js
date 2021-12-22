const CarRent = require('../models/CarRent')
const {tariffRental, sale} = require('../constants/accounting')


class CarController {
    static getCalculatingCostOfCar =  (req, res) => {
        try {
            const {tariff, start, end} = req.params
            const dayPrice = tariffRental[tariff]
            const date1 = new Date(start);
            const date2 = new Date(end);
            const timeDiff = Math.abs(date2.getTime() - date1.getTime());
            const periodDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (periodDays >= 31) {
                return res.status(400).json({mg: 'Максимальный срок аренды автомобиля 30 дней'})
            }
            const dateStartDay =  new Date(start).getDay()
            if(dateStartDay === 6 || dateStartDay === 0) {
                return res.status(400).json({mg: 'Невозможно арендовать автомобиль в выходные дни'})
            }
            let saleValue
            Object.values(sale).forEach((item, index) => {
                saleValue = (item[0] < periodDays < item[1]) && Object.keys(sale)[index]
            })
            const price = periodDays * dayPrice * (100 - saleValue) / 100
            return res.status(200).json(price)
        } catch (e) {
            console.log(e)
            res.status(500).json({message:'invalid request'})
        }
    }

    static postCreateRent = async (req, res) => {
        try {
            const {modelAuto, stateNumber, VIN, dateStart, dateEnd, tariff} = req.body;
            const dateStartDay = new Date(dateStart).getDay()
            if ( dateStartDay === 6 || dateStartDay === 0) {
                return res.status(400).json({mg: 'Невозможно арендовать автомобиль в выходные дни'})
            }
            const date1 = new Date(dateStart);
            const date2 = new Date(dateEnd);
            const timeDiff = Math.abs(date2.getTime() - date1.getTime());
            const periodDay = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (periodDay >= 31) {
                return res.status(400).json({mg: 'Максимальный срок аренды автомобиля 30 дней'})
            }
            const lastRental = await CarRent.findOne({
                dateEnd
            })
            const breakBetweenRentals = lastRental.setDate(lastRental.getDate() + 3)
            if(breakBetweenRentals >= dateStart) {
                return res.status(400).json({mg: 'Минимальный промежуток времени после последней аренды - 3 дня'})
            }
            let carObject = new CarRent({
                stateNumber,
                modelAuto,
                VIN,
                rent: [
                    {
                        dateStart,
                        dateEnd,
                        tariff,
                    }
                ]
            })
            try {
                await  carObject.save()
                res.status(201).json({
                    cleaner: carObject
                })
            } catch (e) {
                console.log(e)
                res.status(500).json({message: 'LOL'})
            }
            return res.status(200).json({modelAuto, stateNumber, VIN, dateStart, dateEnd, tariff})
        } catch (e) {
            res.status(500).json({mg: 'invalid request'})
        }
    }

    static getLoadingAllCars = async (req, res) => {
        try {
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
            const {modelAuto, stateNumber, VIN, rent} = req.body;
            const checkCleaner = await CarRent.findOne({
                VIN
            });
            if (checkCleaner) {
                return res.status(401).json({message: 'vin already exist'})
            }
            let carObject = new CarRent({
                stateNumber,
                modelAuto,
                VIN,
                rent
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



