const service = require('../models/services')

module.exports.index = (req, res) => {
    req.session.url = '/';
    const serviceCategory = service.category
    res.render('home', { serviceCategory})
}

module.exports.chooseCategory = (req, res) => {
    const url = req.body.trade;
    res.redirect(`/services/${url}`);
}

