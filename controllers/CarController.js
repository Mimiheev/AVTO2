const CarRent = require('../models/CarRent')
const {tariffRental, sale} = require('../constants/accounting')


class CarController {
    static calculatingСostOfCar =  (req, res) => {
        try {
            const {tariff, dateStart, dateEnd} = req.params
            const dayPrice = tariffRental[tariff]
            const date1 = new Date(dateStart);
            const date2 = new Date(dateEnd);
            const timeDiff = Math.abs(date2.getTime() - date1.getTime());
            const periodDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const saleValue = Object.values(sale).forEach((item, index) => {
                (item[0] < periodDays < item[1]) && Object.keys(sale)[index]
            })
            let price = periodDays * dayPrice * (100 - saleValue) / 100
            return res.status(200).json(price)
        } catch (e) {
            res.status(500).json({message:'invalid request'})
        }
    }

    static createRent = async (req, res) => {
        try {
            const {modelAuto, stateNumber, VIN, dateStart, dateEnd,  tariff} = req.body;
            const dateStartDay = new Date(dateStart).getDay()
            if ( dateStartDay == 6 || dateStartDay == 0) {
                return res.status(400).json({mg: 'Невозможно арендовать автомобиль в выходные дни'})
            }
            const periodDays = dateEnd.split(' ')[2] - dateStart.split(' ')[2];
            if (periodDays >= 31) {
                return res.status(400).json({mg: 'Максимальный срок аренды автомобиля 30 дней'})
            }
            return res.status(200).json({modelAuto, stateNumber, VIN, dateStart, dateEnd, tariff})
        } catch (e) {
            res.status(500).json({mg: 'invalid request'})
        }

    }

    static loadingAllCars = async (req, res) => {
        try {

            return res.status(200).json({mg: 'successfully'})
        } catch (e) {
            res.status(500).json({mg: 'invalid request'})
        }
    }

    static loadingOneCars = async (req, res) => {
        try {
            const {id} = req.body
            return res.status(200).json({id})
        } catch (e) {
            res.status(500).json({mg: 'invalid request'})
        }

    }

}


module.exports = CarController
