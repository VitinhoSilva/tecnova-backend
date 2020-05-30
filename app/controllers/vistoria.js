const { sqlConfig } = require('../../knexfile.js');
var sql = require('mssql');

var vistoriaUtil = {
    inserirVistoria: inserirVistoria,
    listarVistoria: listarVistoria,
    filtrarVistoria: filtrarVistoria,
    deletarVistoria: deletarVistoria,
    deletarVistoriaObjId: deletarVistoriaObjId,
    atualizarVistoria: atualizarVistoria,
    atualizarVistoriaObjId: atualizarVistoriaObjId
}

module.exports = vistoriaUtil;

function inserirVistoria(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var OBJECTID;
        var VISTORIAID;

        request.query('select max(id_vistoria) + 1 AS PROXIMOVISTORIAID from sde.PT_VISTORIA', 
        function (err, recordset) {
            if (err) console.log(err)
            VISTORIAID = recordset.recordset[0].PROXIMOVISTORIAID;
        
        request.query('select max(OBJECTID) + 1 AS PROXIMOOBJECTID from sde.PT_VISTORIA', 
        function (err, recordset) {
            if (err) console.log(err)
            OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;
  

        if (OBJECTID == null && VISTORIAID == null) {
            OBJECTID = 1;
            VISTORIAID = 1;
        } else {

            request.query('select max(id_vistoria) + 1 AS PROXIMOVISTORIAID from sde.PT_VISTORIA', 
            function (err, recordset) {
                if (err) console.log(err)
                VISTORIAID = recordset.recordset[0].PROXIMOVISTORIAID;
    
            request.query('select max(OBJECTID) + 1 AS PROXIMOOBJECTID from sde.PT_VISTORIA', 
            function (err, recordset) {
                if (err) console.log(err)
                OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;
             });
          });

        }

            var {dt_data} = req.body;

            let query = 'INSERT INTO sde.PT_VISTORIA (OBJECTID, id_vistoria, dt_data) VALUES (' + 
            OBJECTID + ", " + VISTORIAID + ", " + " '" + String(dt_data) + "' " + ')';

            console.log(query);

            request.query(query, 
            function (err, recordset) {
                if (err) console.log("Erro no insert de vistoria ", err)
                
                res.send("Cadastrado com sucesso!");
                sql.close();
            });
         });
      });
        
    });
}

function listarVistoria(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM sde.PT_VISTORIA';

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no listar de vistoria ", err)

            let tratamento = {
                vistoria: recordset.recordset
            }
            res.send(tratamento);
            sql.close();
        });
    });
}

function filtrarVistoria(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM sde.PT_VISTORIA WHERE id_vistoria = ' + req.params.id;

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no filtro de vistoria ", err)
            
            let tratamento = {
                abrigos: recordset.recordset
            }
            res.send(tratamento);
            sql.close();
        });
    });
}

function deletarVistoria(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'DELETE FROM sde.PT_VISTORIA WHERE id_vistoria = '  + req.params.id;
    
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no delete de vistoria ", err)
           
            res.send("Deletado com sucesso!");
            sql.close();
        });
    });
}


function deletarVistoriaObjId(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'DELETE FROM sde.PT_VISTORIA WHERE OBJECTID = '  + req.params.id;
    
        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no delete OBJECTID de vistoria ", err)
           
            res.send("Deletado com sucesso!");
            sql.close();
        });
    });
}

function atualizarVistoria(req, res) {
    sql.connect(sqlConfig, function (err) {
         if (err) console.log(err);
 
        var request = new sql.Request();
 
        var {de_endereco, de_descricao} = req.body;
 
        var query = 'UPDATE sde.PT_VISTORIA SET de_endereco = '+ " '" + String(de_endereco) + "',  de_descricao = '"  + String(de_descricao) + "' " + 'WHERE id_vistoria = ' + req.params.id;

             request.query(query, function (err, recordset) {
             if (err) console.log("Erro no update de vistoria", err)
             res.send("Atualizado com sucesso!");
             sql.close();
         });
     });
 }

 function atualizarVistoriaObjId(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var OBJECTID;
        var VISTORIAID;

        request.query('select max(id_vistoria) + 1 AS PROXIMOVISTORIAID from sde.PT_VISTORIA', 
        function (err, recordset) {
            if (err) console.log(err)
            VISTORIAID = recordset.recordset[0].PROXIMOVISTORIAID;
        
        request.query('select max(OBJECTID) + 1 AS PROXIMOOBJECTID from sde.PT_VISTORIA', 
        function (err, recordset) {
            if (err) console.log(err)
            OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;
  

        if (OBJECTID == null && VISTORIAID == null) {
            OBJECTID = 1;
            VISTORIAID = 1;
        } else {

            request.query('select max(id_vistoria) + 1 AS PROXIMOVISTORIAID from sde.PT_VISTORIA', 
            function (err, recordset) {
                if (err) console.log(err)
                VISTORIAID = recordset.recordset[0].PROXIMOVISTORIAID;
    
            request.query('select max(OBJECTID) + 1 AS PROXIMOOBJECTID from sde.PT_VISTORIA', 
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

            var query = "UPDATE sde.PT_VISTORIA SET id_vistoria = " + VISTORIAID + ", de_endereco = '" + String(de_endereco) + "', de_descricao = '" +
             String(de_descricao) + "', dt_data = '" + String(dt_data) + "' WHERE OBJECTID = " + req.params.id;

            request.query(query, 
            function (err, recordset) {
                if (err) console.log("Erro no updateObjId de vistoria ", err)
                
                res.send("Atualizado com sucesso!");
                sql.close();
            });
         });
      });
        
    });
}
