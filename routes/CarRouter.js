const Router = require('express')
const router = new Router()
const carController = require('../controllers/CarController')

router.get('/calculatingCostOfCar/:dateStart/:dateEnd/:vin/:tariff', carController.getCalculatingCostOfCar)
router.post('/carRent', carController.postCreateRent)
router.get('/loadingAllCars', carController.getLoadingAllCars)
router.get('/loadingOneCars/:vin', carController.getLoadingOneCars)
router.post('/addCar', carController.addCar)

module.exports = router