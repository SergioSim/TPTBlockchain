module.exports = {
    "port": 8086,
    "jwt_secret": "a5uper5ecretJwt!",
    "aes_secret": "a5uper5ecretAes!R5aLly5ecre",
    "jwt_expiration_in_seconds": 1200,
    "permissionLevels": {
        "PUBLIC": 0,
        "CLIENT": 1,
        "BANQUE": 2,
        "ADMIN" : 3
    },
    "mySqlHost": "82.255.166.104",
    "mySqlUser": "OpenchainUser",
    "mySqlPass": "OpenchainUserPassword13?",
    "openchainValidator": "http://82.255.166.104:8085/",
    "openchainObserver": "http://82.255.166.104:8087/",
    "DHTGAssetPath": "/asset/p2pkh/XcKvoyXaJTvttNBTSsditL2ffcaqN7kfVq/"
};