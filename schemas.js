const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.serviceSchema = Joi.object({
    serviceProvider: Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        priceRange: Joi.string().required().escapeHTML(),
        serviceCategory: Joi.object({
            name: Joi.string().escapeHTML(),
            slug: Joi.string().required().escapeHTML()
        }),
        images: Joi.object(),
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        text: Joi.string().required().escapeHTML(),
        reliability: Joi.number().min(0).max(5).integer().required(),
        courtesy: Joi.number().required().min(0).max(5).integer(),
        tidiness: Joi.number().required().min(0).max(5).integer(),
        workmanship: Joi.number().required().min(0).max(5).integer()
    }).required()
})