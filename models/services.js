const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./reviews")

const imageSchema = new Schema({
        url: String,
        filename: String,
})
    
imageSchema.virtual('thumb').get(function () {
    return this.url.replace('/upload', '/upload/w_250')
})

imageSchema.virtual('show').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,g_auto,w_900,h_450')
})

imageSchema.virtual('list').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,g_auto,w_600,h_400')
})

const serviceCategory = [
    {
        name: 'Bathroom Fitter',
        slug: 'bathroom-fitter',
        description: 'Bathroom, kitchen and WC Fitting',
        imageURL: '/images/Bathroom-Fitters.jpg',
    },
    {
        name: 'Painter and Decorator',
        slug: 'painter-decorator',
        description: 'Internal painting and decorating',
        imageURL: '/images/painter-decorator.jpg'
    },
    {
        name: 'Plumber',
        slug: 'plumber',
        description: 'Plumbing repair and maintenance',
        imageURL: '/images/plumber.jpg'
    },
    {
        name: 'Gas /Heating engineer',
        slug: 'heating',
        description: 'Gas boiler - installation',
        imageURL: '/images/heating.jpg'
    },
    {
        name: 'Plasterer /Renderer',
        slug: 'plasterer',
        description: 'Plaster skimming',
        imageURL: '/images/plasterer.jpg'
    },
    {
        name: 'Electrician',
        slug: 'electrician',
        description: 'Electrical installation or testing',
        imageURL: '/images/electritian.jpg'
    },
    {
        name: 'Handyman',
        slug: 'handyman',
        imageURL: '/images/Bathroom-Fitters.jpg'
    }
    
]

const opts = { toJSON: { virtuals: true } };

const serviceSchema = new Schema({
    title: String,
    url: String,
    priceRange: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number]
        }
    },
    serviceCategory: {
        name: String,
        slug: {
            type: String
        }
    },
    images: [imageSchema],
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, opts);



serviceSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/services/show/${this.url}">${this.title}</a>
    <p>${this.location}</p>`
})

serviceSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports.category = serviceCategory;
module.exports.Service = mongoose.model('Service', serviceSchema);