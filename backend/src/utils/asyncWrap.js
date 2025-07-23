/**
 * Wraps an async route handler/middleware to eliminate the need for try/catch blocks
 * 
 * @param {Function} fn - The async function to wrap
 * @returns {Function} Express middleware function that automatically catches errors
 */
const asyncWrap = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncWrap;