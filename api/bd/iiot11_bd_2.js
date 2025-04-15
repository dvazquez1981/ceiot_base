import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

mongoose.set('debug', false); //  Desactiva los logs de consultas

const BACKUP_DIR = "./backup"; // Directorio de backups
const FILE = 'backup_db_2.json';
// URL de conexión a MongoDB (FALTA LEVANTAR DE UN RESOURCE)
const uri = "mongodb://localhost:27017/?maxPoolSize=20&w=majority";	



// Función para guardar los datos en un archivo JSON
export async function backupDatabaseToJson(file=FILE) {
  try {

// Asegurar que el directorio existe
    if (!fs.existsSync(BACKUP_DIR)) {
       fs.mkdirSync(BACKUP_DIR, { recursive: true });
      }

  
  var backupPath = path.join(BACKUP_DIR, file);


  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  
  let allData = [];
  
  for (const collection of collections) {
    const collectionName = collection.name;
    const documents = await db.collection(collectionName).find().toArray();
    allData.push({ collectionName, documents });
  }

  // Guardar toda la base de datos en un archivo JSON
  
  //Guardar los datos en un archivo JSON
   await fs.promises.writeFile(backupPath, JSON.stringify(allData, null, 2));
  console.log(`Estado de la base de datos guardado en: ${backupPath}`);
   
  

} catch (error) {
  console.error('Error al exportar las colecciones:', error);
}
}

async function restoreDataFromJson(file=FILE) {
  try {

    var backupPath = path.join(BACKUP_DIR, file);
 
   
    // Leer el archivo JSON
    const data = fs.readFileSync(backupPath, 'utf-8');
    let collectionsData;
    try {
      collectionsData = JSON.parse(data);
    } catch (err) {
      console.error('Error al parsear el JSON:', err);
      return;
    }

   
    // Obtener la base de datos
    const db = mongoose.connection.db;

    // Verificar que la conexión esté establecida
    if (!db) {
      console.log('No se pudo acceder a la base de datos.');
      return;
    }

    //Obtener todas las colecciones de la base de datos
    const collections = await db.listCollections().toArray();
    //console.log(`Colecciones encontradas en la base de datos: ${collections.map(c => c.name).join(', ')}`);
    for (const collectionInfo of collections) {
      const collection = db.collection(collectionInfo.name);
      await collection.drop();  // Elimina la colección y sus documentos
     // console.log(`Colección eliminada: ${collectionInfo.name}`);
    }

    //console.log('Base de datos limpiada correctamente.');

    // Iterar sobre cada entrada en el archivo JSON
    for (const collectionData of collectionsData) {
      const collectionName = collectionData.collectionName;
      const documents = collectionData.documents;

      // Verificar si tenemos documentos en el archivo JSON para esa colección
      if (documents && documents.length > 0) {
        const collection = db.collection(collectionName);

        // Si la colección no existe, se crea automáticamente al insertar los primeros documentos
       // console.log(`Iniciando restauración de datos en la colección: ${collectionName}`);
        
        // Insertar los documentos en la colección (MongoDB crea la colección si no existe)
        const result = await collection.insertMany(documents, { ordered: false });

        // Log para cada inserción
       // console.log(`Se insertaron ${result.insertedCount} documentos en la colección: ${collectionName}`);
      } else {
        console.log(`No hay datos para la colección: ${collectionName} en el archivo JSON.`);
      }
    }

    console.log('Restauración de datos completada de Mongo.');
  } catch (error) {
    console.error('Error al restaurar los datos:', error);
  }
}



// Configurar
export const  iotdb_2=mongoose.connect( uri/*, { useNewUrlParser: true, useUnifiedTopology: true }*/)
  .then(() => {
    console.log('La conexion se ha realizado correctamente a MongoDB');

    restoreDataFromJson()
    //3 min
    setInterval(backupDatabaseToJson, 180000);
    
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

export default iotdb_2