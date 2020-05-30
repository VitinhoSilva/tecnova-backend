const { sqlConfig } = require('../../knexfile.js');
var sql = require('mssql');

var areaRiscoUtil = {
    listarAreaRisco: listarAreaRisco,
    filtrarAreaRisco: filtrarAreaRisco
}

module.exports = areaRiscoUtil;

function listarAreaRisco(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM sde.PL_AREAS_DE_RISCO';

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no listar de area de risco ", err)

            let tratamento = {
                AreasRisco: recordset.recordset
            }
            res.send(tratamento);
            sql.close();
        });
    });
}

function filtrarAreaRisco(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM sde.PL_AREAS_DE_RISCO WHERE nu_area_risco_id = ' + req.params.id;

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no listar de area de risco ", err)

            let tratamento = {
                AreasRisco: recordset.recordset
            }
            res.send(tratamento);
            sql.close();
        });
    });
}
 