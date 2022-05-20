const { VERSION } = process.env;

const versionProtection = (req, res, next) => {
    const version = req.header("Version");
    
    if (!version) {
        return res.status(426).send("Se requiere la version de la app");
    }
    try {
        if (version !== VERSION) return res.status(426).send("La version no coincide");

    } catch (err) {
        return res.status(426).send("Se requiere la version de la app");
    }
    return next();
};

module.exports = versionProtection;