const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

var authUtil = require('../controllers/auth.js');
var passporttoUtil = require('../config/passport.js');
var userUtil = require('../controllers/user');
var abrigoUtil = require('../controllers/abrigo');
var areaRiscoUtil = require('../controllers/arearisco');
var vistoriaUtil = require('../controllers/vistoria');
var lonaUtil = require('../controllers/solicitacaolona');
var graficoUtil = require('../controllers/grafico');
var gerenciamentoUtil = require('../controllers/gerenciamento');
var resetUtil = require('../controllers/reset');

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

//Login, cadastro esqueci minha senha
app.route('/singup').post(userUtil.inserirUser);
app.route('/singin').post(authUtil.signin);
app.route('/reset').post(resetUtil.reset);
app.route('/newpassword').post(userUtil.atualizarPassword);

//Users
app.route('/users/listar').all(passporttoUtil.authenticate()).get(userUtil.listarUser);
app.route('/users/filtrar/:id').all(passporttoUtil.authenticate()).get(userUtil.filtrarUser)
app.route('/users/deletar/:id').all(passporttoUtil.authenticate()).delete(userUtil.deletarUser);
app.route('/users/atualizar/:id').all(passporttoUtil.authenticate()).post(userUtil.atualizarUser);

//Abrigo
app.route('/abrigo/inserir').all(passporttoUtil.authenticate()).post(abrigoUtil.inserirAbrigo);
app.route('/abrigo/listar').all(passporttoUtil.authenticate()).get(abrigoUtil.listarAbrigo);
app.route('/abrigo/filtrar/:id').all(passporttoUtil.authenticate()).get(abrigoUtil.filtrarAbrigo);
app.route('/abrigo/filtrar/:id').all(passporttoUtil.authenticate()).post(abrigoUtil.filtrarAbrigo);
app.route('/abrigo/deletar/:id').all(passporttoUtil.authenticate()).delete(abrigoUtil.deletarAbrigo);
app.route('/abrigo/deletarObjId/:id').all(passporttoUtil.authenticate()).delete(abrigoUtil.deletarAbrigoObjId);
app.route('/abrigo/atualizar/:id').all(passporttoUtil.authenticate()).put(abrigoUtil.atualizarAbrigo);
app.route('/abrigo/atualizarObjId/:id').all(passporttoUtil.authenticate()).put(abrigoUtil.atualizarAbrigoObjId);

//Área de risco
app.route('/arearisco/listar').all(passporttoUtil.authenticate()).get(areaRiscoUtil.listarAreaRisco);
app.route('/arearisco/filtrar/:id').all(passporttoUtil.authenticate()).get(areaRiscoUtil.filtrarAreaRisco);

//Vistoria
app.route('/vistoria/inserir').all(passporttoUtil.authenticate()).post(vistoriaUtil.inserirVistoria);
app.route('/vistoria/listar').all(passporttoUtil.authenticate()).get(vistoriaUtil.listarVistoria);
app.route('/vistoria/filtrar/:id').all(passporttoUtil.authenticate()).get(vistoriaUtil.filtrarVistoria);
app.route('/vistoria/deletar/:id').all(passporttoUtil.authenticate()).delete(vistoriaUtil.deletarVistoria);
app.route('/vistoria/deletarObjId/:id').all(passporttoUtil.authenticate()).delete(vistoriaUtil.deletarVistoriaObjId);
app.route('/vistoria/atualizar/:id').all(passporttoUtil.authenticate()).put(vistoriaUtil.atualizarVistoria);
app.route('/vistoria/atualizarObjId/:id').all(passporttoUtil.authenticate()).put(vistoriaUtil.atualizarVistoriaObjId);

//Solicitação de lona
app.route('/lona/inserir').all(passporttoUtil.authenticate()).post(lonaUtil.inserirLona);
app.route('/lona/listar').all(passporttoUtil.authenticate()).get(lonaUtil.listarLona);
app.route('/lona/filtrar/:id').all(passporttoUtil.authenticate()).get(lonaUtil.filtrarLona);
app.route('/lona/deletar/:id').all(passporttoUtil.authenticate()).delete(lonaUtil.deletarLona);
app.route('/lona/deletarObjId/:id').all(passporttoUtil.authenticate()).delete(lonaUtil.deletarLonaObjId);
app.route('/lona/atualizar/:id').all(passporttoUtil.authenticate()).put(lonaUtil.atualizarLona);
app.route('/lona/atualizarObjId/:id').all(passporttoUtil.authenticate()).put(lonaUtil.atualizarLonaObjId);

//Graficos
app.route('/grafico/planejamento/evolucaoperdas').get(graficoUtil.evolucaoPerdas);
app.route('/grafico/planejamento/ocupacaoabrigos').get(graficoUtil.ocupacaoAbrigos);

//Cronograma
app.route('/grafico/planejamento/cronograma/listar').get(graficoUtil.listarCronograma);
app.route('/grafico/planejamento/cronograma/inserir').post(graficoUtil.inserirTarefaCronograma);
app.route('/grafico/planejamento/cronograma/filtrar/:id').get(graficoUtil.filtrarCronograma);
app.route('/grafico/planejamento/cronograma/deletar/:id').delete(graficoUtil.deletarCronograma);
app.route('/grafico/planejamento/cronograma/atualizar/:id').put(graficoUtil.atualizarCronograma);

//Gerenciamento
app.route('/gerenciamento/inserir').post(gerenciamentoUtil.inserirPessoa);

module.exports = app;
