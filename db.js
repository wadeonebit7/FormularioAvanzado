const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "libro_visitas"
});

db.connect(err => {
    if (err) {
        console.log("Error MySQL:", err);
        return;
    }
    console.log("MySQL conectado");
});

module.exports = db;