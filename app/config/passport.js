const {authSecret} = require('../../.env');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const { sqlConfig } = require('../../knexfile.js');
var sql = require('mssql');
const { Strategy, ExtractJwt } = passportJwt

    const params = {    
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        sql.connect(sqlConfig, function (err) {
            if (err) console.log(err);
            var request = new sql.Request();
            var query = 'SELECT * FROM users WHERE id = ' + payload.id;
            request.query(query, function (err, recordset) {
                if (err) console.log("Erro no config/passport.js ", err);
                if (recordset.recordset[0].id == payload.id) {
                    
                    var user = new Promise(function(resolve, reject){
                        resolve("Success!");   
                    });
                    user.then(user => done(null, user ? { ...payload } : false));
                }
                sql.close();
            });
        });
    });

    passport.use(strategy);

    var authenticate = {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }

    module.exports = authenticate;
    