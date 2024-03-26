const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

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

const Joi = BaseJoi.extend(extension)

module.exports.audiovisualSchema = Joi.object({
    audiovisual: Joi.object({
        type: Joi.string().required().escapeHTML(),
        title: Joi.string().required().escapeHTML(),
        director: Joi.string().allow('').escapeHTML(),
        main_cast: Joi.string().allow('').escapeHTML(),
        country: Joi.string().allow('').escapeHTML(),
        rating: Joi.string().allow('').escapeHTML(),
        release_year: Joi.number().allow(''),
        duration: Joi.string().allow('').escapeHTML(),
        listed_in: Joi.string().allow('').escapeHTML(),
        description: Joi.string().allow('').escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

const todayDate = new Date();
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        title: Joi.string().allow('').escapeHTML(),
        rating: Joi.number().min(0).max(5).required(),
        where: Joi.string().allow('').escapeHTML(),
        when: Joi.number().min(1920).max(todayDate.getFullYear()).allow(''),
        favorite: Joi.boolean().allow(''),
        notes: Joi.string().required().escapeHTML()
    }).required()
});