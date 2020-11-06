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

app.listen(8080, function () {
  console.log("Servidor ativo na porta 8080");
});
