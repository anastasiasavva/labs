const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const moment = require("moment");

const app = express();
const con = mysql.createConnection({
  host: "localhost",
  user: "nastya",
  password: "nastya"
});

con.connect(err => {
  if (err) throw err;

  console.log("Connected!");
  /* создание таблиц */
  con.query("USE nastya;");
  con.query(
    "CREATE TABLE IF NOT EXISTS сотрудник (" +
      "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
      "фамилия TEXT, " +
      "имя TEXT, " +
      "отчество TEXT, " +
      "должность TEXT, " +
      "подразделение TEXT, " +
      "дата_приема DATE);"
  );
  con.query(
    "CREATE TABLE IF NOT EXISTS отпуск (" +
      "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY," +
      "тип TEXT, " +
      "оплата INT, " +
      "льготы INT);"
  );
  con.query(
    "CREATE TABLE IF NOT EXISTS документ (" +
      "id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
      "номер_документа INT, " +
      "дата_регистрация DATE, " +
      "дата_начала_отпуска DATE, " +
      "дата_окончания_отпуска DATE, " +
      "код_сотрудника INT, " +
      "код_отпуска INT, " +
      "FOREIGN KEY (код_сотрудника) REFERENCES сотрудник(id), " +
      "FOREIGN KEY (код_отпуска) REFERENCES отпуск(id));"
  );

  /* руссификция БД*/
  con.query(
    "ALTER DATABASE nastya CHARACTER SET utf8 COLLATE utf8_general_ci;"
  );
  con.query(
    "ALTER TABLE сотрудник CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;"
  );
  con.query(
    "ALTER TABLE отпуск CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;"
  );
  con.query(
    "ALTER TABLE документ CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;"
  );

  con.query("DROP PROCEDURE IF EXISTS добавить_сотрудника;");
  con.query(
    "CREATE PROCEDURE добавить_сотрудника (f TEXT, i TEXT, o TEXT, d TEXT, p TEXT, da DATE) " +
      "BEGIN " +
      "INSERT INTO сотрудник " +
      "(фамилия, имя, отчество, должность, подразделение, дата_приема) " +
      "VALUES (f, i, d, d, p, da); " +
      "END;"
  );

  con.query("DROP PROCEDURE IF EXISTS добавить_отпуск;");
  con.query(
    "CREATE PROCEDURE добавить_отпуск (t TEXT, o INT, l INT) " +
      "BEGIN " +
      "INSERT INTO отпуск " +
      "(тип, оплата, льготы) " +
      "VALUES (t, o, l); " +
      "END;"
  );

  con.query("DROP PROCEDURE IF EXISTS добавить_документ;");
  con.query(
    "CREATE PROCEDURE добавить_документ (nd INT, dr DATE, dn DATE, do DATE, ks INT, ko INT) " +
      "BEGIN " +
      "INSERT INTO документ " +
      "(номер_документа, дата_регистрация, дата_начала_отпуска, дата_окончания_отпуска, код_сотрудника, код_отпуска) " +
      "VALUES (nd, dr, dn, do, ks, ko); " +
      "END;"
  );
});
/*------*/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

/* товар */

app.get("/employee", (req, res) => {
  const query = "SELECT * FROM сотрудник;";

  con.query(query, (err, result, fields) => {
    if (err) throw err;
    console.log(query);
    res.send(result);
  });
});

app.post("/employee", (req, res) => {
  const {
    фамилия,
    имя,
    отчество,
    должность,
    подразделение,
    дата_приема
  } = req.body;

  const query =
    "CALL добавить_сотрудника " +
    `("${фамилия}", "${имя}", "${отчество}", "${должность}", "${подразделение}", "${дата_приема}");`;

  con.query(query, (err, result, fields) => {
    if (err) throw err;
    console.log(query);
    res.send(result);
  });
});

app.get("/vacation", (req, res) => {
  const query = "SELECT * FROM отпуск;";

  con.query(query, (err, result, fields) => {
    if (err) throw err;
    console.log(query);
    res.send(result);
  });
});

app.post("/vacation", (req, res) => {
  const { тип, оплата, льготы } = req.body;

  const query = `CALL добавить_отпуск ("${тип}", "${оплата}", "${льготы}");`;

  con.query(query, (err, result, fields) => {
    if (err) throw err;
    console.log(query);
    res.send(result);
  });
});

app.get("/document", (req, res) => {
  const query = "SELECT * FROM документ;";

  con.query(query, (err, result, fields) => {
    if (err) throw err;
    console.log(query);
    res.send(result);
  });
});

app.post("/document", (req, res) => {
  const {
    номер_документа,
    дата_регистрация,
    дата_начала_отпуска,
    дата_окончания_отпуска,
    код_сотрудника,
    код_отпуска
  } = req.body;

  const query =
    "CALL добавить_документ" +
    `("${номер_документа}", "${дата_регистрация}", "${дата_начала_отпуска}", "${дата_окончания_отпуска}", "${код_сотрудника}", "${код_отпуска}");`;

  con.query(query, (err, result, fields) => {
    if (err) throw err;
    console.log(query);
    res.send(result);
  });
});

app.listen(8080);

module.exports = app;
