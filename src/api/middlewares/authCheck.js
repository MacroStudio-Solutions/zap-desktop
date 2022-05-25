function authVerify(req, res, next) {
    
    const key = req.headers.authorization.toString()

    if (!key) return res.status(403).send({ error: true, message: 'unauthorized' })

    // if(key !== req.key) return res.status(403).send({ error: true, message: 'Print requisition ' })

    next()
}

module.exports = authVerify