const { sqlConfig } = require('../../knexfile.js');
var sql = require('mssql');
const bcrypt = require('bcrypt-nodejs')

var userUtil = {
    inserirUser: inserirUser,
    listarUser: listarUser,
    filtrarUser: filtrarUser,
    deletarUser: deletarUser,
    atualizarUser: atualizarUser,
    atualizarPassword: atualizarPassword
}

module.exports = userUtil;

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    
function inserirUser(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var {name, email, password} = req.body;
        password = encryptPassword(password);

        var request = new sql.Request();
        var query = 'SELECT * FROM users WHERE email like (' + "'" + email + "'" + ")"
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no inserir de user ", err);
                if(recordset.recordset[0]){
                    if (recordset.recordset[0].email == email) {
                        let tratamento = {
                            response: "Usuário já cadastrado!"
                        }
                        res.json(tratamento);
                        sql.close();
                    }
            } else {
                var query1 = 'INSERT INTO users (name, email, password) VALUES (' + 
                "'" + String(name) + "', '" + String(email) + "', '" + String(password) + "' " + ')';
                request.query(query1, function (err, recordset) {
                    if (err) console.log("Erro no inserir de user ", err);
                    let tratamento = {
                        response: "Usuário cadastrado com sucesso!"
                    }
                    res.status(200).json(tratamento);
                    sql.close();
                });
             }  
        });
    });   
}

function listarUser(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM users';

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no listar de user ", err)
            let tratamento = {
                usuarios: recordset.recordset
            }
            res.send(tratamento);
            sql.close();
        });
    });
}

function filtrarUser(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM users WHERE id = ' + req.params.id;

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no filtrar de user ", err)
            let tratamento = {
                usuario: recordset.recordset
            }
            res.send(tratamento);
            sql.close();
        });
    });
}

function deletarUser(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'DELETE FROM users WHERE id = ' + req.params.id;
    
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no deletar de user ", err)
            res.send("Deletado com sucesso!");
            sql.close();
        });
    });
}

function atualizarUser(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var {name, email} = req.body;

        var request = new sql.Request();
        var query = 'UPDATE users SET name = ' + "'" + String(name) + "', email = '" +
         String(email) + "' " + 'WHERE id = ' + req.params.id;

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no atualizar de user ", err)
            res.send("Atualizado com sucesso!");
            sql.close();
        });
    });
}

function atualizarPassword(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);
        var {email, password} = req.body;
        password = encryptPassword(password);
    
        var request = new sql.Request();
        var query = 'SELECT * FROM users WHERE email like (' + "'" + email + "'" + ")"
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no reset de senha de user ", err);
                if(recordset.recordset[0]){
                       var query = 'UPDATE users SET name = ' + "'" + String(email) + "', password = '" +
                       String(password) + "' " + 'WHERE email like (' + "'" + email + "'" + ")";
                        request.query(query, function (err, recordset) {
                            if (err) console.log("Erro reset senha de user ", err);
                            let tratamento = {
                                response: "Senha atualizada com sucesso!"
                            }
                            res.status(200).json(tratamento);
                            sql.close();
                        });
            } else {
                let tratamento = {
                    response: "Usuário não encontrado!"
                }
                res.json(tratamento);
                sql.close();
             }  
        });
    });
}

