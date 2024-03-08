const Joi = require('joi');

//TODO - see other joi validations necessary
module.exports.audiovisualSchema = Joi.object({
    audiovisual: Joi.object({
        type: Joi.string().required(),
        title: Joi.string().required(),
        rating: Joi.number().max(5).min(0).precision(1).required()
    }).required()
});