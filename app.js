const express = require("express");
const db = require("./db");

function createApp() {

    const app = express();

    app.use(express.json());
    app.use(express.static("public"));


    app.post("/guardar", (req, res)=>{

        const {nombre, correo, comentario} = req.body;

        const sql = `INSERT INTO visitas(nombre, correo, comentario) VALUES(?,?,?)`;

        db.query(sql, [nombre, correo, comentario], (err, result) => {

                if(err){

                    return res.status(500).json({
                        mensaje:"Error al guardar"
                    });

                }

                req.app.get("io").emit("nuevoComentario",{
                    nombre,
                    correo,
                    comentario
                });

                res.json({
                    mensaje:"Guardado correctamente"
                });
            }
        );
    });

    app.get("/ultimo", (req, res)=>{

        const sql = `SELECT * FROM visitas ORDER BY id DESC LIMIT 1`;

        db.query(sql, (err, result) => {

            if(err) return res.status(500).json({ mensaje:"Error" });
            
            if (result.length === 0) {
                return res.json({ vacio: true });
            }
            
            res.json(result[0]);
        });
    });

    app.post("/check-availability", (req, res) => {
        const { type, value } = req.body;
        let sql;

        if(type === "username"){
            sql = "SELECT * FROM visitas WHERE nombre = ?";
        } else if (type === "email"){
            sql = "SELECT * FROM visitas WHERE correo = ?";
        } else if(type === "text"){
            sql = "SELECT * FROM visitas WHERE comentario = ?";
        } else {
            return res.status(400).json({ available: false, error: "Tipo no valido"});
        }

        db.query(sql, [value], (err, result)=>{
            if(err) return res.status(500).json({ available:false });
            res.json({ available: result.length === 0 });
        });
    });

    return app;
}

module.exports = createApp;