import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20).messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a string',
    'string.min': 'Min string length is not achieved. {{#limit}} required',
    'string.max': 'Max string length is achieved',
  }),
  phoneNumber: Joi.string().required().min(3).max(20).messages({
    'any.required': 'Phone number is required',
    'string.base': 'Phone number must be a string',
  }),
  email: Joi.string().email().min(3).max(20).messages({
    'string.email': 'Email must be a valid email address',
    'string.base': 'Email must be a string',
  }),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .default('personal')
    .messages({
      'any.required': 'Contact type is required',
      'any.only': 'Contact type must be one of work, home, personal',
      'string.base': 'Contact type must be a string',
    }),
});
