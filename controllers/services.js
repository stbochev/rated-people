const service = require('../models/services');
const serviceProvider = service.Service;
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

function convertToSlug(Text) {
  return Text.toLowerCase()
             .replace(/[^\w ]+/g, '')
             .replace(/ +/g, '-');
}

function findCategoryName(slug) {
    for (category of service.category) {
        if (category.slug === slug) {
            categoryName = category.name;
            return categoryName
        }
    }
}


module.exports.index = (req, res) => {
    req.session.url = '/services';
    res.render('services/index')
}

module.exports.individualService = async (req, res, next) => {
    const categories = service.category;
    if (req.params.id === 'all') {
        serviceProviders = await serviceProvider.find({});
    } else {
        for (category of categories) {
            if (req.params.id === category.slug) {
                serviceProviders = await serviceProvider.find({ 'serviceCategory.slug' : category.slug} );
                break;
            } else { serviceProviders = undefined }
        }
    }
    if (!serviceProviders) {
        req.flash('error', `There isn't a service category ${req.params.id}`)
        return res.redirect(req.session.url || '/')
    } else {
        req.session.url = '/services' + req.url;
        res.render('services/list', { serviceProviders })
    }
}

module.exports.individualProvider = async (req, res) => {
    const serviceProviderOne = await serviceProvider.findOne({ url: req.params.id }).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
        }).populate("author");
    if (!serviceProviderOne) {
        req.flash('error', 'The service provider you are looking for does not exist');
        if (req.session.url) {
            return res.redirect(req.session.url)
        } else {
            res.redirect('/services/all')
        }
    }
    req.session.url = '/services' + req.url;
    res.render('services/show', { serviceProviderOne })
}

module.exports.newForm = (req, res) => {
    const serviceCategory = service.category;
    res.render('services/new', {serviceCategory})
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const serviceCategory = service.category
    const serviceProviderOne = await serviceProvider.findOne({ url: id });
    if (!serviceProviderOne) {
        req.flash('error', 'The service provider you are looking for does not exist');
        if (req.session.url) { res.redirect(req.session.url) }
        res.redirect('/services/all')
    }
    res.render('services/edit', { serviceProviderOne, serviceCategory })
}

module.exports.createService = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.serviceProvider.location,
        limit: 1
    }).send()
    const categorySlug = req.body.serviceProvider.serviceCategory.slug;
    findCategoryName(categorySlug);
    const serviceProviderOne = new serviceProvider(req.body.serviceProvider);
    serviceProviderOne.images =  req.files.map(f => ({ url: f.path, filename: f.filename }))
    serviceProviderOne.serviceCategory.name = categoryName;
    serviceProviderOne.serviceCategory.slug = categorySlug;
    serviceProviderOne.url = convertToSlug(serviceProviderOne.title);
    serviceProviderOne.author = req.user._id;
    if (geoData.body.features.length) {
       serviceProviderOne.geometry = geoData.body.features[0].geometry; 
    } else {
        req.flash('error', 'Could not find this address, shows just a map');
    }
    const allServices = await serviceProvider.find({ _id: { $ne: serviceProviderOne._id } });
    for (let i of allServices) {
        if (serviceProviderOne.url === i.url) {
            serviceProviderOne.url = serviceProviderOne.url + 1;
        }
    }
    await serviceProviderOne.save();
    req.flash('success', 'Service provider succesfully created!')
    res.redirect(`/services/show/${serviceProviderOne.url}`)
}

module.exports.updateService = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.serviceProvider.location,
        limit: 1
    }).send()
    const { id } = req.params;
    const serv = await serviceProvider.findOneAndUpdate({ url: id }, { ...req.body.serviceProvider }, { new: true });
    imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    serv.images.push(...imgs);
    const categorySlug = req.body.serviceProvider.serviceCategory.slug;
    findCategoryName(categorySlug); 
    serv.serviceCategory.name = categoryName;
    serv.serviceCategory.slug = categorySlug;
    serv.url = convertToSlug(serv.title);
    if (geoData.body.features.length) {
       serv.geometry = geoData.body.features[0].geometry; 
    } else {
        serv.geometry = {};
        req.flash('error', 'Could not find this address, shows just a map');
    }
    const allServices = await serviceProvider.find({ _id: { $ne: serv._id } });
    for (let i of allServices) {
        if (serv.url === i.url) {
            serv.url = serv.url + 1;
            continue;
        }}
    await serv.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await serv.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    };
    req.flash('success', 'Service provider succesfully updated!')
    res.redirect(`/services/show/${serv.url}`)
}

module.exports.deleteService = async (req, res) => {
    const { id } = req.params;
    const serv = await serviceProvider.findOneAndDelete({ url: id });
    for (let removeImg of serv.images) {
            await cloudinary.uploader.destroy(removeImg.filename);
        }
    req.flash('success', 'Service provider succesfully deleted!');
    res.redirect('/services/all')
}