const { sqlConfig } = require('../../knexfile.js');
var sql = require('mssql');
var moment = require('moment');

var graficoUtil = {
	evolucaoPerdas: evolucaoPerdas,
    ocupacaoAbrigos: ocupacaoAbrigos,
    listarCronograma: listarCronograma,
    inserirTarefaCronograma: inserirTarefaCronograma,
    deletarCronograma: deletarCronograma,
    atualizarCronograma: atualizarCronograma,
    filtrarCronograma: filtrarCronograma
};

module.exports = graficoUtil;

function evolucaoPerdas(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err){
            console.log(err);
            res.send("Erro de conexão: ", err)
        } else {
        var request = new sql.Request();
        var query = "SELECT DT_DATA, COUNT(DE_STATUS) AS QUANTIDADE FROM SDE.PT_CADASTRO_PESSOA"
						+" WHERE DE_STATUS = 'FATAL'"
						+" GROUP BY DT_DATA"
						+" UNION"
						+" SELECT DE_DATA_OCORRENCIA, COUNT(DE_OCORRENCIA) AS QUANTIDADE FROM SDE.PL_EDIFICACAO"
						+" WHERE DE_OCORRENCIA = 'sim'"
						+" GROUP BY DE_DATA_OCORRENCIA";

        request.query(query, function (err, recordset) {
            if (err){
                res.send("Erro no evolucaoPerdas", err);
            } else {
                let tratamento = {
                    grafico: recordset.recordset
                }
                res.send(tratamento);
            }
            sql.close();
        });
       }
    });
}

function ocupacaoAbrigos(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err){
            console.log(err);
            res.send("Erro de conexão: ", err)
        } else {
        var request = new sql.Request();
        var query = "SELECT DE_NOME, NU_OCUPACAO, DT_ALTERACAO_OCUPACAO FROM SDE.PT_ABRIGO";

        request.query(query, function (err, recordset) {
            if (err){
                res.send("Erro no ocupacaoAbrigos", err);
            } else {  
                let tratamento = {
                    grafico: recordset.recordset
                }
                res.send(tratamento);
            }
            sql.close();
        });
       }
    });
}

function inserirTarefaCronograma(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err){
            console.log(err);
            res.send("Erro no inserirTarefaCronograma");
        }
        
        var request = new sql.Request();

        var OBJECTID;
        var TAREFAID;

        request.query('SELECT MAX(task_id) + 1 AS PROXTAREFAID FROM SDE.TB_CRONOGRAMA',
        function (err, recordset) {
            if (err){
                console.log(err);
                res.send("Erro no inserirTarefaCronograma");
            }
            TAREFAID = recordset.recordset[0].PROXTAREFAID;

        request.query('select max(objectid) + 1 AS PROXIMOOBJECTID from SDE.TB_CRONOGRAMA', 
        function (err, recordset) {
            if (err){
                console.log(err);
                res.send("Erro no inserirTarefaCronograma");
            }
            OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;

            if (OBJECTID == null && TAREFAID == null) {
                OBJECTID = 1;
                TAREFAID = 1;
            } else {

                request.query('SELECT MAX(task_id) + 1 AS PROXTAREFAID FROM SDE.TB_CRONOGRAMA',
                function (err, recordset) {
                    if (err){
                        console.log(err);
                        res.send("Erro no inserirTarefaCronograma");
                    }
                    TAREFAID = recordset.recordset[0].PROXTAREFAID;

                    request.query('select max(objectid) + 1 AS PROXIMOOBJECTID from SDE.TB_CRONOGRAMA', 
                    function (err, recordset) {
                        if (err){
                            console.log(err);
                            res.send("Erro no inserirTarefaCronograma");
                        }
                    OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;
                });
            });

            }

            var {task_name, resource, start_date, end_date, duration, percent_complete} = req.body;

            //console.log(moment(start_date, end_date).fromNow());

            let query = 'INSERT INTO SDE.TB_CRONOGRAMA (OBJECTID, task_id, task_name, resource, start_date, end_date, duration, percent_complete) VALUES ('
            + OBJECTID +','+ TAREFAID + ", '" + String(task_name) + "' , '" + String(resource)+ "' ," + " '" + String(start_date) + "', '" + String(end_date) + "', '" + String(duration) + "', " +
            percent_complete + ")";
            
            request.query(query, function (err, recordset) {
                if (err){ 
                    res.send("Erro no insert da tarefa do cronograma", err);
                } else {
                    res.send("Cadastrado com sucesso!");
                }
                sql.close();
            });
          });
        });
    });
}

function listarCronograma(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = "SELECT * FROM SDE.TB_CRONOGRAMA";

        request.query(query, function (err, recordset) {
            if (err){
                res.send("Erro no listar da tarefa do cronograma", err);
            } else {
                let tratamento = {
                    cronograma: recordset.recordset
                }
                res.send(tratamento);
            }
            sql.close();
        });
    });
}

function filtrarCronograma(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = 'SELECT * FROM SDE.TB_CRONOGRAMA WHERE SDE.TB_CRONOGRAMA.task_id = ' + req.params.id;

        request.query(query, function (err, recordset) {
            if (err) console.log("Erro no filtro de Cronograma ", err)
            
            let tratamento = {
                cronograma: recordset.recordset
            }
            res.send(tratamento);
            sql.close();
        });
    });
}

function deletarCronograma(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var query = "delete from sde.TB_CRONOGRAMA where task_id = " + req.params.id;

        request.query(query, function (err, recordset) {
            if (err){
                res.send("Erro no deletar da tarefa do cronograma", err);
            } else {
                res.send("Deletado com sucesso!");
            }
            sql.close();
        });
    });
}

function atualizarCronograma(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var {task_name, resource, start_date, end_date, duration, percent_complete} = req.body;

        var query = "UPDATE SDE.TB_CRONOGRAMA SET task_name =" + " '" + String(task_name) + "', resource =" + " '" + String(resource) + "', start_date =" 
        + " '" + String(start_date) + "', end_date =" + " '" + String(end_date) + "', duration =" + duration + ", percent_complete =" + percent_complete +  " WHERE task_id =" +  req.params.id;

        request.query(query, function (err, recordset) {
            if (err){
                res.send("Erro no atualizar da tarefa do cronograma", err);
            } else {
                res.send("Atualizado com sucesso!");
            }
            sql.close();
        });
    });
}