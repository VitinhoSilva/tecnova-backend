const { sqlConfig } = require('../../knexfile.js');
var sql = require('mssql');

var gerenciamentoUtil = {
    inserirPessoa: inserirPessoa
};

module.exports = gerenciamentoUtil;

function inserirPessoa(req, res) {
    sql.connect(sqlConfig, function (err) {
        if (err) console.log(err);
        
        var request = new sql.Request();

        var OBJECTID;
        var PESSOAID;

        request.query('SELECT MAX(id_pessoa) + 1 AS PROXPESSOAID FROM sde.PT_CADASTRO_PESSOA',
        function (err, recordset) {
            if (err) console.log(err)
            PESSOAID = recordset.recordset[0].PROXPESSOAID;

        request.query('select max(objectid) + 1 AS PROXIMOOBJECTID from sde.PT_CADASTRO_PESSOA', 
        function (err, recordset) {
            if (err) console.log(err)
            OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;

            if (OBJECTID == null && PESSOAID == null) {
                OBJECTID = 1;
                PESSOAID = 1;
            } else {

                request.query('SELECT MAX(id_pessoa) + 1 AS PROXPESSOAID FROM sde.PT_CADASTRO_PESSOA',
                function (err, recordset) {
                    if (err) console.log(err)
                    PESSOAID = recordset.recordset[0].PROXPESSOAID;

                    request.query('select max(objectid) + 1 AS PROXIMOOBJECTID from sde.PT_CADASTRO_PESSOA', 
                    function (err, recordset) {
                    if (err) console.log(err)
                    OBJECTID = recordset.recordset[0].PROXIMOOBJECTID;
                });
            });

            }

            var {de_nome, de_tipo_residencia, nu_filhos, de_profissao, de_tipo_sangue, de_restricoes, de_recorrencia, de_endereco, de_tipo_contrato, de_parente, de_cartao_sus, de_observacao, de_status, dt_data, de_encaminhamento} = req.body;
            var x = new Date();
            var hoje = x.toISOString();
            
            let query = 'INSERT INTO sde.PT_CADASTRO_PESSOA (OBJECTID, id_pessoa, de_nome, de_tipo_residencia, nu_filhos, de_profissao, de_tipo_sangue, de_restricoes, de_recorrencia, de_endereco, de_tipo_contrato, de_parente, de_cartao_sus, de_observacao, de_status, dt_data, de_encaminhamento) VALUES ('
            + OBJECTID +','+ PESSOAID +",'" + String(de_nome) + "','" + String(de_tipo_residencia)+ "'," + nu_filhos + ",'" + String(de_profissao) + "','" + String(de_tipo_sangue) + "','" + String(de_restricoes) + "','" + String(de_recorrencia) + "','" + String(de_endereco) + "','" + String(de_tipo_contrato) + "','" + String(de_parente) + "','" + String(de_cartao_sus) + "','" + String(de_observacao) + "','" + String(de_status) + "','" + String(hoje) + "','" + String(de_encaminhamento) + "')"; 
            
            request.query(query, 
            function (err, recordset) {
                if (err) console.log("Erro no insert de pessoa ", err)
                console.log('sucesso ao cadastrar pessoa');
                res.send("Cadastrado com sucesso!");
                sql.close();
            });
          });
        });
    });
}