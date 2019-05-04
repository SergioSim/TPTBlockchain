module.exports = {
    "port": 8086,
    "jwt_secret": "a5uper5ecretJwt!",
    "jwt_expiration_in_seconds": 1200,
    "permissionLevels": {
        "PUBLIC": 0,
        "CLIENT": 1,
        "BANQUE": 2,
        "ADMIN" : 3
    }
};
