const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: 'Debes iniciar sesión con GitHub' });
};

module.exports = isAuthenticated;