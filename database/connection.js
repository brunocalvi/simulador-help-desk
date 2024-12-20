const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

function connectionBD() {
  try {
    const connection = new Sequelize(process.env.BD_BASE, process.env.BD_USER, process.env.BD_PASS, {
        host: process.env.BD_HOST,
        dialect: "mysql",
        timezone: "-03:00",
        logging: false
      }
    );

    connection.authenticate().then(() => {
      console.log("Conexão com o banco de dados realizada com sucesso!");
    }).catch((error) => {
      console.log(error);
    });

    return connection;
  } catch (error) {
    console.error("Erro ao conectar no banco de dados:", error.message);
    process.exit(1);
  }
}

const connection = connectionBD();
module.exports = connection;