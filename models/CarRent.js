const Mongoose = require('mongoose')


const carRent = new Mongoose.Schema ({

    modelAuto: {type: String, required: true},

    VIN: {type: String, required: true, unique: true},

    stateNumber: {type: String, required: true},
    rent: [
        {
            dateStart: { type: Date, default: Date.now },

            dateEnd: { type: Date, default: Date.now },

            tariff: {type: String},
        }
    ],

})


module.exports = Mongoose.model('carRent', carRent)