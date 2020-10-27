var express = require("express");
var app = express();
var mysql = require("mysql");

var connection = mysql.createConnection({

});
connection.connect();

/**
 * Obtendo todos marcadores
 */
app.get("/", function (req, res) {
  connection.query("SELECT * FROM tb_estrutura", function (err, rows, fields) {
    if (err) throw err;
    console.log("acesso ao banco!");
    res.json(rows);
  });

  // connection.end();
});

/**
 * Insercao de dados
 */
app.post("/", function (req, res) {
  // var json = req.body.json;

  // connection.query("INSERT ")
});

app.listen(8080, function () {
  console.log("Servidor ativo no porto 8080");
});
