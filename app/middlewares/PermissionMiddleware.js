exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.level);
        if (required_permission_level.includes(user_permission_level)) {
            return next();
        } else {
            return res.status(403).send();
        }
    };
 };