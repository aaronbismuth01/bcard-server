// Shared regular expressions for mongoose schemas and Joi validations
const PHONE = /^0[0-9]{1,2}-?\s?[0-9]{3}\s?[0-9]{4}$/;
const EMAIL = /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/;
// 7-20 chars with at least one uppercase, one lowercase, one digit and one special character
const PASSWORD = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*\-_]).{7,20}$/;
const URL = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

module.exports = { PHONE, EMAIL, PASSWORD, URL };
