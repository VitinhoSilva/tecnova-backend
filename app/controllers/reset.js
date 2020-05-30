const { sqlConfig } = require('../../knexfile.js');
var sql = require('mssql');
const nodemailer = require('nodemailer');
const {gmail} = require('../../.env');

var resetUtil = {
    reset: reset
}

module.exports = resetUtil;

function reset(req, res) {
    var {email} = req.body;

    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);
    
        var request = new sql.Request();
        var query = 'SELECT * FROM users WHERE email like (' + "'" + email + "'" + ")"
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no inserir de user ", err);
                if(!recordset.recordset[0]){
                        let tratamento = {
                            response: "Usuário não encontrado!"
                        }
                        res.json(tratamento);
                        sql.close();
        } else {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmail.EMAIL,
                    pass: gmail.PASSWORD
                }
                
            });
            
            var mailOptions = {
                from: gmail.EMAIL,
                to: email,
                subject: 'Recuperação de senha GeoDefesa',
                text: 'Clique aqui http://tecnova/reset/ para recuperar sua senha, se você não solicitou desconsidere esse email, obrigado.' // pular linha: \n
            };
            
            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log('ERRO: ', err);
                    let tratamento = {
                        response: "Erro, tente novamente!"
                    }
                    res.status(500).json(tratamento);
                    sql.close();
                } else {
                    let tratamento = {
                        response: "E-mail enviado com sucesso!"
                    }
                    res.status(200).json(tratamento);
                    sql.close();
                }
            });
            sql.close();
          }  
       });
    });
}
