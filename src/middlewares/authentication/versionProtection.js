const { VERSION } = process.env;

const versionProtection = (req, res, next) => {
    const version = req.header("Version");
    
    if (!version) {
        return res.status(426).send("La ultima version de la aplicacion es requerida");
    }
    try {
        if (version !== VERSION) return res.status(426).send("La ultima version de la aplicacion es requerida");

    } catch (err) {
        return res.status(426).send("La ultima version de la aplicacion es requerida");
    }
    return next();
};

module.exports = versionProtection;