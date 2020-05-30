const { sqlConfig } = require('../../knexfile.js');
var sql = require('mssql');

var abrigoUtil = {
    inserirAbrigo: inserirAbrigo,
    listarAbrigo: listarAbrigo,
    filtrarAbrigo: filtrarAbrigo,
    deletarAbrigo: deletarAbrigo,
    atualizarAbrigo: atualizarAbrigo,
    atualizarAbrigoObjId: atualizarAbrigoObjId,
    deletarAbrigoObjId: deletarAbrigoObjId
}

module.exports = abrigoUtil;

function inserirAbrigo(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);
        
        var request = new sql.Request();

        var OBJECTID;
        var ABRIGOID;

        request.query('SELECT MAX(nu_abrigo_id) + 1 AS PROXABRIGOID FROM sde.PT_ABRIGO',
        function (err, recordset) {
            if (err) console.log(err)
            ABRIGOID = recordset.recordset[0].PROXABRIGOID;

        request.query('select max(objectid) + 1 AS PROXIMOOBJECTID from sde.PT_ABRIGO', 
        function (err, recordset) {
            if (err) console.log(err)
            OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;

            if (OBJECTID == null && ABRIGOID == null) {
                OBJECTID = 1;
                ABRIGOID = 1;
            } else {

                request.query('SELECT MAX(nu_abrigo_id) + 1 AS PROXABRIGOID FROM sde.PT_ABRIGO',
                function (err, recordset) {
                    if (err) console.log(err)
                    ABRIGOID = recordset.recordset[0].PROXABRIGOID;

                    request.query('select max(objectid) + 1 AS PROXIMOOBJECTID from sde.PT_ABRIGO', 
                    function (err, recordset) {
                    if (err) console.log(err)
                    OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;
                });
            });

            }

            var {de_nome, de_endereco, nu_capacidade, nu_ocupacao, foto} = req.body;
            var x = new Date();
            var hoje = x.toISOString();
            
            let query = 'INSERT INTO sde.PT_ABRIGO (OBJECTID, nu_abrigo_id, de_nome, de_endereco, nu_capacidade, nu_ocupacao, dt_alteracao_ocupacao, foto) VALUES ('
            + OBJECTID +','+ ABRIGOID + ", '" + String(de_nome) + "' , '" + String(de_endereco)+ "' ," + nu_capacidade + ',' + nu_ocupacao + ", '" + String(hoje) 
            + "', '" + String(foto) + "' " + ")";

            console.log(query);

            request.query(query, 
            function (err, recordset) {
                if (err) console.log("Erro no insert de abrigo ", err)
                
                res.send("Cadastrado com sucesso!");
                sql.close();
            });
          });
        });
    });
}

function listarAbrigo(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM SDE.PT_ABRIGO';

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no listar de abrigo ", err)

            for (var i = recordset.recordset.length - 1; i >= 0; i--) {
                if (recordset.recordset[i].foto){
                    let removerFoto = '';
                    // Remover foto para melhorar performance no ato de listar todos!
                    recordset.recordset[i].foto = removerFoto;
                }
            }

                var tratamento = {
                    abrigos: recordset.recordset
                }
                res.send(tratamento);
            sql.close();
        });
    });
}


function filtrarAbrigo(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM SDE.PT_ABRIGO WHERE SDE.PT_ABRIGO.NU_ABRIGO_ID = ' + req.params.id;

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no filtro de abrigo ", err)

            for (var i = recordset.recordset.length - 1; i >= 0; i--) {
                if (recordset.recordset[i].foto){
                    let buffer = recordset.recordset[i].foto.toString().replace(/\n/g, '').replace(/\\/g, '');
                    recordset.recordset[i].foto = buffer;
                }
            }
            
            let tratamento = {
                abrigos: recordset.recordset
            }
            res.send(tratamento);
            sql.close();
        });
    });
}

function deletarAbrigo(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'DELETE FROM SDE.PT_ABRIGO WHERE SDE.PT_ABRIGO.NU_ABRIGO_ID = '  + req.params.id;
    
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no delete de abrigo ", err)
           
            res.send("Deletado com sucesso!");
            sql.close();
        });
    });
}

function deletarAbrigoObjId(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'DELETE FROM SDE.PT_ABRIGO WHERE OBJECTID = ' + req.params.id;
    
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no delete de abrigo pelo OBJECTID", err)
           
            res.send("Deletado com sucesso!");
            sql.close();
        });
    });
}

function atualizarAbrigo(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var {de_nome, de_endereco, nu_capacidade, nu_ocupacao, foto} = req.body;

        var request = new sql.Request();

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + '/' + mm + '/' + dd;
        var dt_alteracao_ocupacao = today;

        var query = "UPDATE SDE.PT_ABRIGO SET de_nome = "  + " '" + String(de_nome) +  "',  de_endereco = '" + String(de_endereco) + "', nu_capacidade = " +
        nu_capacidade + ", nu_ocupacao = " + nu_ocupacao + ", dt_alteracao_ocupacao = '" + String(dt_alteracao_ocupacao) + "', foto =  CONVERT(VARBINARY(max), '" + String(foto) + "') " + " WHERE nu_abrigo_id = "  + req.params.id;
        
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no atualizar de abrigo ", err)
            res.send("Atualizado com sucesso!");
            sql.close();
        });
    });
}

function atualizarAbrigoObjId(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var ABRIGOID;

        request.query('SELECT MAX(nu_abrigo_id) + 1 AS PROXABRIGOID FROM sde.PT_ABRIGO',
        function (err, recordset) {
            if (err) console.log(err)
            ABRIGOID = recordset.recordset[0].PROXABRIGOID;

            if (ABRIGOID == null) {
                ABRIGOID = 1;
            } else {
                request.query('SELECT MAX(nu_abrigo_id) + 1 AS PROXABRIGOID FROM sde.PT_ABRIGO',
                function (err, recordset) {
                    if (err) console.log(err)
                    ABRIGOID = recordset.recordset[0].PROXABRIGOID;
            });

            }

        var {de_nome, de_endereco, nu_capacidade, nu_ocupacao, foto} = req.body;

        var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = yyyy + '/' + mm + '/' + dd;
            var dt_alteracao_ocupacao = today;

        
        var query = "UPDATE SDE.PT_ABRIGO SET de_nome = "  + " '" + String(de_nome) +  "',  de_endereco = '" + String(de_endereco) + "', nu_capacidade = " +
        nu_capacidade + ", nu_ocupacao = " + nu_ocupacao + ", nu_abrigo_id = " + ABRIGOID  +  ", dt_alteracao_ocupacao = '" + String(dt_alteracao_ocupacao) + "', foto =  CONVERT(VARBINARY(max), '" + String(foto) + "') " + " WHERE OBJECTID = "  + req.params.id;         
        
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no atualizar de abrigoObjId ", err);
            else {
                res.send("Inserido com sucesso!");
            }
        
            sql.close();
        });
      });
   });
}
