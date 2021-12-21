const { dateStart, dateEnd } = require('../models/CarRent')

const tariffRental = {
    FIRST: 270,
    SECOND: 330,
    THIRD: 390
}

const sale = {
    5: [3, 5],
    10: [6, 14],
    15: [15, 30]
}

// const dateStartDay = new Date(dateStart).getDay()

// const periodDays = dateEnd.split(' ')[2] - dateStart.split(' ')[2];

module.exports = {
    tariffRental,
    sale
}

// const date1 = new Date(dateStart);
// const date2 = new Date(dateEnd);
// const timeDiff = Math.abs(date2.getTime() - date1.getTime());
// const periodDays = Math.ceil(timeDiff / (1000 * 3600 * 24));