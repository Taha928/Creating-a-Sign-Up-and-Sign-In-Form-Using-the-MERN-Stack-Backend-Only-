const { createError } = require('../utils/ResponseMessage');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessage = error.details
                .map(detail => detail.message)
                .join(', ');
            return createError(res, 400, errorMessage);
        }
        
        next();
    };
};

module.exports = validateRequest; 