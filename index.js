var express = require("express");
var app = express();
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "lg132717",
  database: "cadastro",
});
connection.connect();

/**
 * Obter dados das tabelas auxiliares
 */
app.get("/tab_auxiliar", function (req, res) {
  console.log(req.query.table);
  let tabela = req.query.table;

  connection.query(`SELECT * FROM ${tabela}`, function (err, rows, fields) {
    if (err) throw err;
    console.log("acesso ao banco!");
    res.json(rows);
  });
});

/**
 * Insercao de dados
 */
app.post("/add_lote", function (req, res) {
  dado_lote = JSON.parse(req.query.lote);

  connection.query(
    `INSERT INTO tb_lote (fk_ocupacao,	fk_patrimonio, fk_relevo, fk_lim_testada,	fk_uso,	fk_caracterizacao) 
     VALUES (${dado_lote[0]}, ${dado_lote[1]}, ${dado_lote[2]}, ${dado_lote[3]}, ${dado_lote[4]}, ${dado_lote[5]}) `,
    function (err) {
      if (err) throw err;

      console.log("Lote inserido!");
      res.end("Inserido");
    }
  );
});

app.post("/add_edificacao", function (req, res) {
  dado_edificacao = JSON.parse(req.query.edificacao);

  connection.query(
    `INSERT INTO tb_edificacao (fk_estrutura,	fk_revestimento_externo,	fk_piso,	fk_forro,	fk_revestimento_interno,	
      fk_pintura,	fk_inst_eletr_hidra,	fk_cobertura,	fk_posicao,	fk_sit_construcao,	fk_esquadrias,	
      fk_est_conservacao) 
     VALUES (${dado_edificacao[0]},${dado_edificacao[1]},${dado_edificacao[2]},${dado_edificacao[3]},
            ${dado_edificacao[4]},${dado_edificacao[5]},${dado_edificacao[6]},${dado_edificacao[7]},
            ${dado_edificacao[8]},${dado_edificacao[9]},${dado_edificacao[10]}, ${dado_edificacao[11]})`,
    function (err) {
      if (err) throw err;

      console.log("Edificação inserida!");
      res.end("Inserido");
    }
  );
});

app.post("/add_residentes", function (req, res) {
  dado_residente = JSON.parse(req.query.residentes);

  connection.query(
    `INSERT INTO tb_residentes (homens,	mulheres,	outros_generos,	menores_um_ano,	um_a_tres,	quatro_a_cinco,	
      seis_a_nove,	dez_a_quinze,	dezessei_a_vinte_um,	vinte_dois_a_quarenta_cinco,	
      quarenta_seis_a_sessenta,	maiores_sessenta) 
     VALUES (${dado_residente[0]},${dado_residente[1]},${dado_residente[2]},${dado_residente[3]},
      ${dado_residente[4]},${dado_residente[5]},${dado_residente[6]},${dado_residente[7]},
      ${dado_residente[8]},${dado_residente[9]},${dado_residente[10]},${dado_residente[11]})`,
    function (err) {
      if (err) throw err;

      console.log("Residentes Inseridos!");
      res.end("Residentes Inseridos!");
    }
  );
});

app.post("/add_educacao", function (req, res) {
  dado_educacao = JSON.parse(req.query.educacao);

  connection.query(
    `INSERT INTO tb_educacao (analfabetos, usuarios_de_creche, pre_escola_publica, pre_escola_particular, 
      fundamental_publico, fundamental_particular, medio_publico, medio_particular, superior_publico, 
      superior_particular)
     VALUES (${dado_educacao[0]}, ${dado_educacao[1]}, ${dado_educacao[2]}, ${dado_educacao[3]}, ${dado_educacao[4]}, 
        ${dado_educacao[5]}, ${dado_educacao[6]}, ${dado_educacao[7]}, ${dado_educacao[8]}, ${dado_educacao[9]})  
    `,
    function (err) {
      if (err) throw err;

      console.log("Educação Inserida!");
      res.end("Educação Inserida!");
    }
  );
});

app.post("/add_saude", function (req, res) {
  dado_saude = JSON.parse(req.query.educacao);

  connection.query(
    `INSERT INTO tb_saude (cancer, cardiopata, def_auditiva, def_visual, def_fisica, def_mental, dengue, dep_quimica, 
      depressao, diabetes, dist_linguagem, fibromalgia, hanseniase, hipertensao, parkinson, tuberculose, aids)
     VALUES(${dado_saude[0]},${dado_saude[1]},${dado_saude[2]},${dado_saude[3]},${dado_saude[4]},${dado_saude[5]},
      ${dado_saude[6]},${dado_saude[7]},${dado_saude[8]},${dado_saude[9]},${dado_saude[10]},${dado_saude[11]},
      ${dado_saude[12]},${dado_saude[13]},${dado_saude[14]},)
    `,
    function (err) {
      if (err) throw err;

      console.log("Saúde Inserida!");
      res.end("Saúde Inserida!");
    }
  );
});

app.post("/add_socioeconomicos", function (req, res) {
  dado_socioeconomico = JSON.parse(req.query.socioeconomico);

  connection.query(
    `INSERT INTO tb_socioeconomicos (aposentados, pensionistas, desempregados, empregado_no_comercio, 
      empregado_na_industria, empregado_em_servico, empregado_rural, empregado_setor_publico, autonomo,
      empregado_informal, veiculos_local, veiculos_fora, renda_famliar)
     VALUES (${dado_socioeconomico[0]},${dado_socioeconomico[1]},${dado_socioeconomico[2]},${dado_socioeconomico[3]},
      ${dado_socioeconomico[4]},${dado_socioeconomico[5]},${dado_socioeconomico[6]}, ${dado_socioeconomico[7]}, 
      ${dado_socioeconomico[8]},${dado_socioeconomico[9]},${dado_socioeconomico[10]}, ${dado_socioeconomico[11]}, 
      ${dado_socioeconomico[12]},)
    `,
    function (err) {
      if (err) throw err;

      console.log("Socioeconomicos Inseridos!");
      res.end("Socioeconomicos Inseridos!");
    }
  );
});

app.post("/add_beneficios", function (req, res) {
  let dado_beneficios = JSON.parse(req.query.beneficios);

  connection.query(
    `INSERT INTO tb_benef_assistenciais (acao_jovem	bolsa_familia, bpc, renda_cidada, viva_leite)
     VALUES (${dado_beneficios[0]},${dado_beneficios[1]},${dado_beneficios[2]},${dado_beneficios[3]})
    `,
    function (err) {
      if (err) throw err;

      console.log(err);
      res.end(err);
    }
  );
});

app.post("/add_cadastro", function (req, res) {
  let dado_cadastro = JSON.parse(req.query.cadastro);

  connection.query(
    `INSERT INTO tb_cadastro (fk_lote, fk_edificacao, fk_residentes, fk_comunicacao, fk_educacao, fk_saude, 
      fk_socioeconomicos, fk_benef_assistenciais)
     VALUES (${dado_cadastro[0]},${dado_cadastro[1]},${dado_cadastro[2]},${dado_cadastro[3]},${dado_cadastro[4]},
      ${dado_cadastro[5]},${dado_cadastro[6]},${dado_cadastro[7]})
    `,
    function(err){
      if (err) throw err;

      console.log(err);
      res.end(err);
    }
  );
});

app.listen(8080, function () {
  console.log("Servidor ativo na porta 8080");
});