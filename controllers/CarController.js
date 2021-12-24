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
            res.status(500).json({message:'invalid request'})
        }
    }

    static postCreateRent = async (req, res) => {
        try {
            const {rent} = req.body;
            const dateStartDay = new Date(rent[0].dateStart).getDay()
            if ( dateStartDay === 6 || dateStartDay === 0) {
                return res.status(400).json({mg: 'Невозможно арендовать автомобиль в выходные дни'})
            }
            const date1 = new Date(rent[0].dateStart);
            const date2 = new Date(rent[0].dateEnd);
            const timeDiff = Math.abs(date2.getTime() - date1.getTime());
            const periodDay = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (periodDay >= 31) {
                return res.status(400).json({mg: 'Максимальный срок аренды автомобиля 30 дней'})
            }
            const lastRental = await CarRent.findOne({VIN: req.body.VIN}, () => {})
            const dateLastRental = lastRental.rent[lastRental.rent.length - 1].dateEnd
            const breakBetweenRentals = new Date(dateLastRental.setDate(dateLastRental.getDate() + 3))
            if(breakBetweenRentals >= rent[0].dateStart) {
                return res.status(400).json({mg: 'Минимальный промежуток времени после последней аренды - 3 дня'})
            }
            await CarRent.findOneAndUpdate (
                {
                    VIN: req.body.VIN,
                },
                {
                    $push: {rent: rent}
                },
                {new: true},
                async  (err, doc) =>{
                    if (err) {
                        res.status(500).json({message: 'LOL'})
                    } else {
                        res.status(200).json(doc)
                    }
                });
            try {
            } catch (e) {
                res.status(500).json({message: 'LOL'})
            }
        } catch (e) {
            res.status(500).json({mg: 'invalid request'})
        }
    }

    static getLoadingAllCars = async (req, res) => {
        //use find for get all cars
        const getAllCars = await CarRent.find()
        // use ForEach on all cars
        const allCars = getAllCars.forEach()
        //let = counterAllPeriod , let = counterRentPeriod
        //get all periods get first object on array rent & get start date on it & get last object from array (length -1 ) for get end date
        //create all period
        //create rent period create let = counter, use forEach on array rent,in body forEach you need use formula time diff for startdate & enddate
        // statistic one car = rentPeriod/allPeriod * 100
        try {
            return res.status(200).json({mg: 'successfully'})
        } catch (e) {
            res.status(500).json({mg: 'invalid request'})
        }
    }

    static getLoadingOneCars = async (req, res) => {
        try {
            //vin
            const {VIN} = req.params
            //find one by vin
            const cars = await CarRent.findOne({VIN})
            const dateFirstRental = cars.rent.length
            const dateLastRental = cars.rent[cars.rent.length - 1].dateEnd
            const timeDiff = Math.abs(dateLastRental.getTime() - dateFirstRental.getTime());
            const rentPeriod = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const allRent = cars.rent.length
            const averageWorkload = (allRent / rentPeriod * 100).toFixed(1)
            console.log('===1',allRent)
            console.log('===1',rentPeriod)
            //get all periods get first object on array rent & get start date on it & get last object from array (length -1 ) for get end date
            //create all period
            //create rent period create let = counter, use forEach on array rent,in body forEach you need use formula time diff for startdate & enddate
            // rentPeriod/allRent * 100

            return res.status(200).json('Средняя загруженность автомобиля - ' + averageWorkload + '%')
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



