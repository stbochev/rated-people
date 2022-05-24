const { serviceSchema, reviewSchema } = require('./schemas.js');
const service = require('./models/services');
const serviceProvider = service.Service;
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/reviews')


module.exports.validateService = (req, res, next) => {
        const {error} = serviceSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(','); 
            throw new ExpressError(msg, 400)
        } else {next()}
}

module.exports.validateReviews = (req, res, next) => {
        const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(','); 
            throw new ExpressError(msg, 400)
        } else {next()}
}

module.exports.authorize = async (req, res, next) => {
    const { id } = req.params;
    const serviceProviderOne = await serviceProvider.findOne({ url: id });
    if (!serviceProviderOne.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/services/show/${serviceProviderOne.url}`)
    }
    next();
}

module.exports.reviewAuthorize = async (req, res, next) => {
    const { id,revID } = req.params;
    const review = await Review.findById(revID);
    const serviceProviderOne = await serviceProvider.findOne({ url: id });
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/services/show/${serviceProviderOne.url}`)
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to do that');
        return res.redirect('/users/login');
    }
    next();
}