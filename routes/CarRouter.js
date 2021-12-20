const Router = require('express')
const router = new Router()
const carController = require('../controllers/CarController')

router.get('/calculatingСostOfCar/:dateStart/:dateEnd/:vin/:tarrif', carController.calculatingСostOfCar)
router.post('/carRent', carController.createRent)
router.get('/loadingAllCars', carController.loadingAllCars)
router.get('/loadingOneCars/:id', carController.loadingOneCars)

module.exports = router