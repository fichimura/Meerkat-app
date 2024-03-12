const Joi = require('joi');

//TODO - see other joi validations necessary
module.exports.audiovisualSchema = Joi.object({
    audiovisual: Joi.object({
        type: Joi.string().required(),
        title: Joi.string().required(),
        director: Joi.string().allow(''),
        main_cast: Joi.string().allow(''),
        country: Joi.string().allow(''),
        rating: Joi.string().allow(''),
        release_year: Joi.number().allow(''),
        duration: Joi.string().allow(''),
        listed_in: Joi.string().allow(''),
        description: Joi.string().allow('')
    }).required()
});