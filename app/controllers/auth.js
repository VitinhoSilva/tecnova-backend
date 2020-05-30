const {authSecret} = require('../../.env');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const { sqlConfig } = require('../../knexfile.js');
var sql = require('mssql');

    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            let ERRO ='Informe usuário e senha!';
            res.json({
                ERRO
            });
        }
        sql.connect(sqlConfig, function (err) {
            if (err) console.log(err);
            var request = new sql.Request();
            var query = 'SELECT * FROM users WHERE email like (' + "'" + req.body.email + "'" + ")"

            request.query(query, function (err, recordset) {
                if (err) console.log("Erro no signin de config/auth.js ", err);
                if (!recordset.recordset[0]) {
                    let ERRO ='Usuário não encontrado!';
                    res.json({
                        ERRO
                    });
                    sql.close();
                } else {
                    const isMatch = bcrypt.compareSync(req.body.password, recordset.recordset[0].password)
                    if (!isMatch) {
                        let ERRO ='Email/Senha inválidos!';
                    res.json({
                        ERRO
                    });
                        sql.close();
                    } else {
                        const now = Math.floor(Date.now() / 1000);

                     var user = {
                         id: recordset.recordset[0].id,
                         name: recordset.recordset[0].name,
                         email: recordset.recordset[0].email,
                     }
                        const payload = {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            iat: now,
                            exp: now + (60 * 30)
                            //ex: 60 segundos * 30 minutos * 24 horas * 1 dia
                        }
                
                        res.json({
                            ...payload,
                            token: jwt.encode(payload, authSecret)
                        })
                        sql.close();
                    }
                }
            });
        });
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(e) {
            let ERRO = {
                'ERRO':'Token inválido!'
            };

            console.log("ERRO: ", e);

            res.status(401).send(ERRO);
        }

        res.send(false)
    }

    var auth = {
        signin, validateToken
    }

    module.exports = auth;