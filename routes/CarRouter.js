const Router = require('express')
const router = new Router()
const carController = require('../controllers/CarController')
//http://localhost:5000/api/calculatingCostOfCar/'dateStart'/'dateEnd'/'VIN'/'tariff'
router.get('/calculating-cost-of-car/:dateStart/:dateEnd/:tariff', carController.getCalculatingCostOfCar)
router.post('/carRent', carController.postCreateRent)
router.get('/loadingAllCars', carController.getLoadingAllCars)
router.get('/loadingOneCars/:vin', carController.getLoadingOneCars)
router.post('/addCar', carController.addCar)

module.exports = router