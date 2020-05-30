const { sqlConfig } = require('../../knexfile.js');
var sql = require('mssql');

var lonaUtil = {
    inserirLona: inserirLona,
    listarLona: listarLona,
    filtrarLona: filtrarLona,
    deletarLona: deletarLona,
    deletarLonaObjId: deletarLonaObjId,
    atualizarLona: atualizarLona,
    atualizarLonaObjId: atualizarLonaObjId
}

module.exports = lonaUtil;

function inserirLona(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var OBJECTID;
        var LONAID;

        request.query('select max(id_solicitacao_lona) + 1 AS PROXIMOLONAID from SDE.PT_SOLICITACAO_LONA', 
        function (err, recordset) {
            if (err) console.log(err)
            LONAID = recordset.recordset[0].PROXIMOLONAID;
        
        request.query('select max(OBJECTID) + 1 AS PROXIMOOBJECTID from SDE.PT_SOLICITACAO_LONA', 
        function (err, recordset) {
            if (err) console.log(err)
            OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;
  

        if (OBJECTID == null && LONAID == null) {
            OBJECTID = 1;
            LONAID = 1;
        } else {

            request.query('select max(id_solicitacao_lona) + 1 AS PROXIMOLONAID from SDE.PT_SOLICITACAO_LONA', 
            function (err, recordset) {
                if (err) console.log(err)
                LONAID = recordset.recordset[0].PROXIMOLONAID;
    
            request.query('select max(OBJECTID) + 1 AS PROXIMOOBJECTID from SDE.PT_SOLICITACAO_LONA', 
            function (err, recordset) {
                if (err) console.log(err)
                OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;
             });
          });

        }
            var {dt_data} = req.body;

            let query = 'INSERT INTO FROM SDE.PT_SOLICITACAO_LONA (OBJECTID, id_solicitacao_lona, dt_data) VALUES (' + 
            OBJECTID + ", " + LONAID + ", " + " '" + String(dt_data) + "' " + ')';

            console.log(query);

            request.query(query, 
            function (err, recordset) {
                if (err) console.log("Erro no insert de lona ", err)
                
                res.send("Cadastrado com sucesso!");
                sql.close();
            });
         });
      });
        
    });
}

function listarLona(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM SDE.PT_SOLICITACAO_LONA';

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no listar de lona ", err)

            let tratamento = {
                Lonas: recordset.recordset
            }
            res.send(tratamento);
            sql.close();
        });
    });
}

function filtrarLona(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM SDE.PT_SOLICITACAO_LONA WHERE id_solicitacao_lona = ' + req.params.id;

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no filtrar de lona ", err)
            
            let tratamento = {
                abrigos: recordset.recordset
            }
            res.send(tratamento);
            sql.close();
        });
    });
}

function deletarLona(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'DELETE FROM SDE.PT_SOLICITACAO_LONA WHERE id_solicitacao_lona = '  + req.params.id;
    
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no delete de lona ", err)
           
            res.send("Deletado com sucesso!");
            sql.close();
        });
    });
}

function deletarLonaObjId(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'DELETE FROM SDE.PT_SOLICITACAO_LONA WHERE OBJECTID = '  + req.params.id;
    
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no delete de lona ", err)
           
            res.send("Deletado com sucesso!");
            sql.close();
        });
    });
}

function atualizarLona(req, res) {
   sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

       var request = new sql.Request();

       var {de_endereco, de_descricao} = req.body;

       var query = 'UPDATE SDE.PT_SOLICITACAO_LONA SET de_endereco = '+ " '" + String(de_endereco) + "',  de_descricao = '"  + String(de_descricao) + "' " + 'WHERE id_solicitacao_lona = ' + req.params.id;

            request.query(query, function (err, recordset) {
            if (err) console.log("Erro no update de lona", err)
            res.send("Atualizado com sucesso!");
            sql.close();
        });
    });
}

function atualizarLonaObjId(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var OBJECTID;
        var LONAID;

        request.query('select max(id_solicitacao_lona) + 1 AS PROXIMOLONAID from SDE.PT_SOLICITACAO_LONA', 
        function (err, recordset) {
            if (err) console.log(err)
            LONAID = recordset.recordset[0].PROXIMOLONAID;
        
        request.query('select max(OBJECTID) + 1 AS PROXIMOOBJECTID from SDE.PT_SOLICITACAO_LONA', 
        function (err, recordset) {
            if (err) console.log(err)
            OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;
  

        if (OBJECTID == null && LONAID == null) {
            OBJECTID = 1;
            LONAID = 1;
        } else {

            request.query('select max(id_solicitacao_lona) + 1 AS PROXIMOLONAID from SDE.PT_SOLICITACAO_LONA', 
            function (err, recordset) {
                if (err) console.log(err)
                LONAID = recordset.recordset[0].PROXIMOLONAID;
    
            request.query('select max(OBJECTID) + 1 AS PROXIMOOBJECTID from SDE.PT_SOLICITACAO_LONA', 
            function (err, recordset) {
                if (err) console.log(err)
                OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;
             });
          });

        }
            var {de_endereco, de_descricao} = req.body;

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = yyyy + '/' + mm + '/' + dd;
            var dt_data = today;

            let query = "UPDATE SDE.PT_SOLICITACAO_LONA SET id_solicitacao_lona = " + LONAID + ", de_endereco = '" + String(de_endereco) + "', de_descricao = '" +
             String(de_descricao) + "', dt_data = '" + String(dt_data) + "' WHERE OBJECTID = " + req.params.id;

            request.query(query, 
            function (err, recordset) {
                if (err) console.log("Erro no updateObjId de lona ", err)
                
                res.send("Atualizado com sucesso!");
                sql.close();
            });
         });
      });
        
    });
}
