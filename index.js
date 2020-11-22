const express = require("express");
const mysql = require("mysql");
const cors = require('cors')
const bodyParser = require("body-parser");
const { request } = require("express");
const req = require("request");
const { json } = require("body-parser");

const app = express();
const jsonParser = bodyParser.json();

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
app.get("/dados_coletados", cors(), function (req, res) {
  connection.query(
    `SELECT * FROM 
      tb_cadastro, tb_beneficiosAssistenciais, tb_comunicacao, tb_edificacao, tb_educacao, 
      tb_endereco, tb_lote, tb_residentes, tb_saude, tb_socioeconomicos 
      where 
      tb_cadastro.id = tb_beneficiosAssistenciais.id_cadastro AND tb_cadastro.id = tb_comunicacao.id_cadastro 
      AND tb_cadastro.id = tb_edificacao.id_cadastro AND tb_cadastro.id = tb_educacao.id_cadastro 
      AND tb_cadastro.id = tb_endereco.id_cadastro AND tb_cadastro.id = tb_lote.id_cadastro 
      AND tb_cadastro.id = tb_residentes.id_cadastro AND tb_cadastro.id = tb_saude.id_cadastro 
      AND tb_cadastro.id = tb_socioeconomicos.id_cadastro`,
    function (err, rows, fields) {
      if (err) throw err;
      console.log("acesso ao banco!");
      // console.log(rows);
      res.json(rows);
    }
  );
});

/**
 * Insercao de dados
 */
app.post("/armazenar_coleta", jsonParser, async function (req, res) {
  // dado_lote = JSON.parse();

  const endereco = req.body.endereco;
  const terreno = req.body.terreno;
  const edificacao = req.body.edificacao;
  const residentes = req.body.residentes;
  const educacao = req.body.educacao;
  const comunicacao = req.body.comunicacao;
  const beneficios = req.body.beneficios;
  const socioeconomicos = req.body.socioeconomicos;
  const doencas = req.body.doencas;

  // console.log(req.body);

  // criando um registro novo para cadastro
  connection.query(
    `INSERT INTO tb_cadastro (id) VALUES (0)`,
    function (err, result) {
      if (err) throw err;
      else {
        inserir_endereco(result.insertId, endereco);
        inserir_terreno(result.insertId, terreno);
        inserir_edificacao(result.insertId, edificacao);
        inserir_residentes(result.insertId, residentes); // arrumar quantidade
        inserir_educacao(result.insertId, educacao); // arrumar quantidade
        inserir_saude(result.insertId, doencas); // arrumar quantidade
        inserir_socioeconomicos(result.insertId, socioeconomicos); // arrumar quantidade
        inserir_beneficios(result.insertId, beneficios);
        inserir_comunicacao(result.insertId, comunicacao);
      }
    }
  );

  res.end(`{reposta: "inserido"}`);

  // inserir_lote();
});

/**
 * Armazena o endereço de uma coleta.
 * @param {number} id_coleta index da coleta referenciada.
 * @param {Object} endereco dados referentes ao endereço da coleta.
 */
function inserir_endereco(id_coleta, endereco) {
  endereco.rua = endereco.rua === undefined ? null : `${endereco.rua}`;
  endereco.numero = endereco.numero === undefined ? null : `${endereco.numero}`;
  endereco.complemento =
    endereco.complemento === "" ? null : `"${endereco.complemento}"`;
  endereco.bairro = endereco.bairro === undefined ? null : `${endereco.bairro}`;
  endereco.cidade = endereco.cidade === undefined ? null : `${endereco.cidade}`;

  let endereco_url = encodeURIComponent(
    endereco.rua.replace(/ /g, "+") +
      "+" +
      endereco.numero +
      "+" +
      endereco.bairro.replace(/ /g, "+") +
      "+" +
      endereco.cidade
  );

  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${endereco_url}&key=AIzaSyDx67AXBO2zmnl6nV6_piHwf2rxRBd7AIY`;

  req(url, function (err, res) {
    if (!err && res.statusCode == 200) {
      result_json = JSON.parse(res.body);
      result_json = result_json.results[0].geometry.location;
      connection.query(
        `INSERT INTO tb_endereco (id_cadastro, rua, numero, complemento, bairro, cidade, lat, lng)
          VALUES (${id_coleta},"${endereco.rua}",${endereco.numero},${endereco.complemento},"${endereco.bairro}","${endereco.cidade}", ${result_json.lat}, ${result_json.lng});`,
        function (err, result) {
          if (err) throw err;
          console.log("Endereço inserido!");
        }
      );
    } else {
      console.log(err);
      console.log(res.body);
    }
  });
}

/**
 * Armazena o terreno de uma coleta.
 * @param {number} id_coleta index da coleta referenciada.
 * @param {Object} terreno dados referentes ao terreno da coleta.
 */
function inserir_terreno(id_coleta, terreno) {
  connection.query(
    `INSERT INTO tb_lote (id_cadastro, id_ocupacao, id_patrimonio, id_relevo,	id_limTestada,	id_uso, id_caracterizacao) 
      VALUES (${id_coleta}, ${terreno.ocupacao},${terreno.patrimonio},${terreno.relevo},${terreno.limite_testada}, ${terreno.uso},${terreno.caracterizacao});`,
    function (err, result) {
      if (err) throw err;
      console.log("Terreno inserido!");
    }
  );
}

/**
 * Armazena a edificação de uma coleta.
 * @param {number} id_coleta index da coleta referenciada.
 * @param {Object} edificacao dados referentes à edificação da coleta.
 */
function inserir_edificacao(id_coleta, edificacao) {
  // console.log(edificacao);

  connection.query(
    `INSERT INTO tb_edificacao (id_cadastro, id_estrutura, id_revestimentoExterno, id_piso, id_forro, id_revestimentoInterno, 
                                id_pintura, id_instalacaoEH, id_cobertura, id_posicao, id_situacaoConstrucao, id_esquadrias, 
                                id_estadoConservacao) 
     VALUES (${id_coleta},${edificacao.estrutura},${edificacao.revestimento_externo},${edificacao.piso},
            ${edificacao.forro},${edificacao.revestimento_interno},${edificacao.pintura},${edificacao.inst_eh},
            ${edificacao.cobertura},${edificacao.posicao},${edificacao.sit_construcao}, ${edificacao.esquadrias}, ${edificacao.est_conservacao})`,
    function (err) {
      if (err) throw err;

      console.log("Edificação inserida!");
    }
  );
}

/**
 * Armazena os residentes de uma coleta.
 * @param {number} id_coleta index da coleta referenciada.
 * @param {Object} residentes dados referentes aos residentes da coleta.
 */
function inserir_residentes(id_coleta, residentes) {
  connection.query(
    `INSERT INTO tb_residentes (  id_cadastro, homens, mulheres, outros_generos, menos_um, um_a_tres, quatro_a_cinco, seis_a_nove, 
                                  dez_a_quinze, dezesseis_a_vinteum, vintedois_a_quarentacinco, quarentaseis_a_sessenta, mais_sessenta) 
     VALUES (${id_coleta}, ${residentes.homens},${residentes.mulheres},${residentes.outros_generos},${residentes.um_ano},
      ${residentes.um_a_tres},${residentes.quatro_a_cinco},${residentes.seis_a_nove},${residentes.dez_a_quinze},
      ${residentes.dezesseis_a_vinteum},${residentes.vintedois_a_quarentacinco},${residentes.quarentacinco_a_sessenta},${residentes.sessenta_anos})`,
    function (err) {
      if (err) throw err;

      console.log("Residentes Inseridos!");
    }
  );
}

/**
 * Armazena a educacao de uma coleta.
 * @param {number} id_coleta index da coleta referenciada.
 * @param {Object} educacao dados referentes à educação da coleta.
 */
function inserir_educacao(id_coleta, educacao) {
  if (educacao != 0) {
    connection.query(
      `INSERT INTO tb_educacao (id_cadastro, analfabetos, usuario_creche, pre_publica, pre_particular, fundamental_publica, 
                              fundamental_particular, medio_publico, medio_particular, superior_publico, superior_particular)
     VALUES (${id_coleta}, ${educacao.analfabetos}, ${educacao.creche}, ${educacao.pre_publica}, ${educacao.pre_particular}, ${educacao.fund_publico}, 
        ${educacao.fund_particular}, ${educacao.medio_publico}, ${educacao.medio_particular}, ${educacao.sup_publico}, ${educacao.sup_particular})  
    `,
      function (err) {
        if (err) throw err;

        console.log("Educação Inserida!");
      }
    );
  } else {
    console.log("Educação Inserida!");
  }
}

/**
 * Armazena a saude de uma coleta.
 * @param {number} id_coleta index da coleta referenciada.
 * @param {Object} saude dados referentes à saúde da coleta.
 */
function inserir_saude(id_coleta, saude) {
  if (saude != 0) {
    connection.query(
      `INSERT INTO tb_saude (id_cadastro, cardiopatia, def_auditiva, def_fisica, def_visual, def_mental, dengue, dep_quimico, depressao, 
                                dist_linguagem, fibromialgia, hanseniase, hipertensao, mal_parkinson, tuberculose, aids)
         VALUES(${id_coleta},${saude.cardiopatia},${saude.def_auditiva},${saude.def_fisica},${saude.def_visual},${saude.def_mental},${saude.dengue},
          ${saude.dep_quimica},${saude.depressao},${saude.dist_linguagem},${saude.fibromialgia},${saude.hanseniase},${saude.hipertensao},
          ${saude.mal_de_parkinson},${saude.tuberculose},${saude.aids})
        `,
      function (err) {
        if (err) throw err;

        console.log("Saúde Inserida!");
      }
    );
  } else {
    console.log("Saúde Inserida!");
  }
}

/**
 * Armazena o socioeconomico de uma coleta.
 * @param {number} id_coleta index da coleta referenciada.
 * @param {Object} socioeconomicos dados referentes ao socioeconomico da coleta.
 */
function inserir_socioeconomicos(id_coleta, socioeconomicos) {
  if (socioeconomicos != 0) {
    connection.query(
      `INSERT INTO tb_socioeconomicos ( id_cadastro, aposentados, pensionistas, desempregados, emp_comercio, emp_industria, 
                                      emp_servico, emp_rurais, emp_publico, autonomo, emp_informais, vei_local, vei_fora)
     VALUES (${id_coleta}, ${socioeconomicos.aposentados},${socioeconomicos.pensionistas},${socioeconomicos.desempregados},
            ${socioeconomicos.emp_comercio}, ${socioeconomicos.emp_industria},${socioeconomicos.emp_servico},${socioeconomicos.emp_rurais}, 
            ${socioeconomicos.emp_setor_publico}, ${socioeconomicos.autonomo},${socioeconomicos.emp_informal},${socioeconomicos.veiculos_local}, 
            ${socioeconomicos.veiculos_fora})`,
      function (err) {
        if (err) throw err;

        console.log("Socioeconomicos Inseridos!");
      }
    );
  } else {
    console.log("Socioeconomicos Inseridos!");
  }
}

/**
 * Armazena o benefício de uma coleta.
 * @param {number} id_coleta index da coleta referenciada.
 * @param {Object} beneficios dados referentes aos benefícios da coleta.
 */
function inserir_beneficios(id_coleta, beneficios) {
  // console.log(beneficios);
  connection.query(
    `INSERT INTO tb_beneficiosAssistenciais (id_cadastro, acao_jovem, bolsa_familia, bpc, renda_cidada, viva_leite)
     VALUES (${id_coleta}, ${beneficios.acao_jovem},${beneficios.bolsa_familia},${beneficios.bpc},${beneficios.renda_cidada}, ${beneficios.viva_leite})
    `,
    function (err) {
      if (err) throw err;
      console.log("Benefícios inseridos!");
    }
  );
}

/**
 * Armazena a comunicação de uma coleta.
 * @param {number} id_coleta index da coleta referenciada.
 * @param {Object} comunicacao dados referentes aos benefícios da coleta.
 */
function inserir_comunicacao(id_coleta, comunicacao) {
  connection.query(
    `INSERT INTO tb_comunicacao (id_cadastro, telefone, internet)
     VALUES (${id_coleta}, ${comunicacao.telefone_fixo},${comunicacao.internet})
    `,
    function (err) {
      if (err) throw err;
      console.log("Comunicação inserida!");
    }
  );
}

app.listen(8080, function () {
  console.log("Servidor ativo na porta 8080");
});
