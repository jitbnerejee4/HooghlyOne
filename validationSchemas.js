const BaseJoi= require('joi');
const sanitizeHtml = require('sanitize-html');


const extension = (joi) =>({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean= sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
})
const Joi= BaseJoi.extend(extension);

module.exports.validateDeathIntimationSchema= Joi.object({ //this is joi schema. This will validate our data before we attemt to save it in mongoose.
    ppoNo: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    dateofdeath: Joi.date().required(),
    bankname: Joi.string().required().escapeHTML(),
    branchname: Joi.string().required().escapeHTML(),
    acno: Joi.number().required(),
    id: Joi.number().required(),
    fileno: Joi.number(),
    applicant: Joi.string().required().escapeHTML(),
    relation: Joi.string().required().escapeHTML(),
    mobile: Joi.number().min(10).required(),
    ["g-recaptcha-response"]: Joi.string().required()
})
module.exports.validateRestorationSchema= Joi.object({ //this is joi schema. This will validate our data before we attemt to save it in mongoose.
    ppoNo: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    dateofbirth: Joi.date().required(),
    basic: Joi.number().required(),
    bankname: Joi.string().required().escapeHTML(),
    branchname: Joi.string().required().escapeHTML(),
    acno: Joi.number().required(),
    id: Joi.number().required(),
    fileno: Joi.number(),
    mobile: Joi.number().min(10).required()
})
module.exports.validateEightySchema= Joi.object({ //this is joi schema. This will validate our data before we attemt to save it in mongoose.
    ppoNo: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    dateofbirth: Joi.date().required(),
    bankname: Joi.string().required().escapeHTML(),
    branchname: Joi.string().required().escapeHTML(),
    acno: Joi.number().required(),
    id: Joi.number().required(),
    fileno: Joi.number(),
    mobile: Joi.number().min(10).required()
})
module.exports.validateEightyFiveSchema= Joi.object({ //this is joi schema. This will validate our data before we attemt to save it in mongoose.
    ppoNo: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    dateofbirth: Joi.date().required(),
    bankname: Joi.string().required().escapeHTML(),
    branchname: Joi.string().required().escapeHTML(),
    acno: Joi.number().required(),
    id: Joi.number().required(),
    fileno: Joi.number(),
    mobile: Joi.number().min(10).required()
})

module.exports.validateNinetySchema= Joi.object({ //this is joi schema. This will validate our data before we attemt to save it in mongoose.
    ppoNo: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    dateofbirth: Joi.date().required(),
    bankname: Joi.string().required().escapeHTML(),
    branchname: Joi.string().required().escapeHTML(),
    acno: Joi.number().required(),
    id: Joi.number().required(),
    fileno: Joi.number(),
    mobile: Joi.number().min(10).required()
})
module.exports.validateNinetyFiveSchema= Joi.object({ //this is joi schema. This will validate our data before we attemt to save it in mongoose.
    ppoNo: Joi.string().required().escapeHTML(),
    name: Joi.string().required().escapeHTML(),
    dateofbirth: Joi.date().required(),
    bankname: Joi.string().required().escapeHTML(),
    branchname: Joi.string().required().escapeHTML(),
    acno: Joi.number().required(),
    id: Joi.number().required(),
    fileno: Joi.number(),
    mobile: Joi.number().min(10).required()
})