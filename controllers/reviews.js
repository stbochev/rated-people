const service = require('../models/services');
const serviceProvider = service.Service;
const Review = require('../models/reviews');

module.exports.createReview = async (req, res) => {
    const serviceProviderOne = await serviceProvider.findOne({ url: req.params.id });
    const review = new Review(req.body.review);
    review.author = req.user._id;
    serviceProviderOne.reviews.push(review);
    await review.save();
    await serviceProviderOne.save();
    req.flash('success', 'You have posted your review succesfully!')
    res.redirect(`/services/show/${serviceProviderOne.url}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, revID } = req.params;
    await serviceProvider.findOneAndUpdate({ url: id }, { $pull: { reviews: revID } });
    await Review.findByIdAndDelete(revID);
    req.flash('success', 'You have deleted your review!')
    res.redirect(`/services/show/${id}`)
}