import { Sequelize } from 'sequelize';
import { newDb } from 'pg-mem';
import fs from 'fs';
import path from 'path';


const BACKUP_DIR = "./backup"; // Directorio de backups
const FILE = 'backup_db_1.sql';

export let db

async function restoreDatabaseSqlScript(file=FILE)
{

var backupPath = path.join(BACKUP_DIR, file);  
if (fs.existsSync(backupPath)) {
   
  const sqlScript = fs.readFileSync(backupPath, 'utf8');

  // Crear una nueva instancia de la base de datos en memoria
  db = newDb();

  // Obtener el esquema público
  const publicSchema = db.public;

  // Ejecutar las instrucciones SQL en el esquema público
  publicSchema.none(sqlScript);

  console.log('Restauración de datos completada en sql');
} 

else
{
// Crear la base de datos en memoria
// caso no lectura
db= newDb();
/*
db.public.none("CREATE TABLE devices (device_id VARCHAR, name VARCHAR, key VARCHAR)");
db.public.none("INSERT INTO devices VALUES ('00', 'Fake Device 00', '123456')");
db.public.none("INSERT INTO devices VALUES ('01', 'Fake Device 01', '234567')");
db.public.none("CREATE TABLE users (user_id VARCHAR, name VARCHAR, key VARCHAR)");
db.public.none("INSERT INTO users VALUES ('1','Ana','admin123')");
db.public.none("INSERT INTO users VALUES ('2','Beto','user123')");*/
console.log('Nueva base de datos creada y datos iniciales insertados');

}
}

export async function backupDatabaseToSqlScript(file=FILE) {
  try {

    // Asegurar que el directorio existe
    if (!fs.existsSync(BACKUP_DIR)) {
       fs.mkdirSync(BACKUP_DIR, { recursive: true });
      }

  
   var backupPath = path.join(BACKUP_DIR, file);

    // Consultar las tablas en la base de datos
    const tables = await db.public.many("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");

    if (tables.length === 0) {
      console.log('No hay tablas en la base de datos.');
      return;
    }

    let sqlScript = '';

    // Iterar sobre cada tabla
    for (const table of tables) {
      const tableName = table.table_name;

      //console.log(`Procesando tabla: ${tableName}`);

      // Obtener la estructura de la tabla (columnas)
      const columns = await db.public.many(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${tableName}'`);

      let createTableSQL = `CREATE TABLE ${tableName} (`;

      // Generar el SQL para las columnas
      columns.forEach((column, index) => {
        createTableSQL += `${column.column_name} ${column.data_type}`;
        if (index < columns.length - 1) createTableSQL += ', ';
      });
      createTableSQL += ');\n';
      sqlScript += createTableSQL;

      // Obtener los datos de la tabla
      const rows = await db.public.many(`SELECT * FROM ${tableName}`);

      if (rows.length === 0) {
        console.log(`No hay datos en la tabla ${tableName}`);
      }

      // Generar las instrucciones INSERT para cada fila
      rows.forEach(row => {
        const columns = Object.keys(row);
        const values = columns.map(col => `'${row[col]}'`).join(', ');

        sqlScript += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});\n`;
      });
    }

    // Verificar si el script SQL tiene contenido
    if (sqlScript === '') {
      console.log('No se generó ningún script SQL.');
      return;
    }

    // Escribir el script SQL en el archivo
    fs.writeFileSync(backupPath, sqlScript);
    console.log('Estado de la base de datos guardado en: '+backupPath);
  } catch (error) {
    console.error('Error al realizar el respaldo de la base de datos:', error);
  }
}

restoreDatabaseSqlScript()

// Configurar Sequelize con `pg-mem`
export const iotdb_1 = new Sequelize({
  dialect: 'postgres',
  dialectModule: db.adapters.createPg(),
  timezone: 'America/Argentina/Buenos_Aires',
  logging: false, 
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});



// Conexión
(async () => {
  try {
    await iotdb_1.authenticate();
    //3 min
    setInterval(backupDatabaseToSqlScript, 180000);

    console.log('La conexión se ha realizado correctamente en sql.');
  } catch (error) {
    console.error('No se ha podido conectar en sql:', error);
  }
})();


export default iotdb_1