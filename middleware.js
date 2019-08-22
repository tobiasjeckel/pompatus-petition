exports.requireSignature = function(req, res, next) {
    if (!req.session.sigid) {
        return res.redirect("/petition");
    }
    next();
};

exports.requireNoLogin = function(req, res, next) {
    if (req.session.id) {
        return res.redirect("/petition");
    }
    next();
};
