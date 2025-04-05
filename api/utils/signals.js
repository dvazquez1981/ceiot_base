import {backupDatabaseToSqlScript} from '../bd/iiot11_bd_1.js'
import {backupDatabaseToJson} from '../bd/iiot11_bd_2.js'




// Manejadores para señales de terminación
process.on('SIGINT', () => {
    console.log('SIGINT guardando los backups...');
    backupDatabaseToSqlScript()
    backupDatabaseToJson()
    // Agregar lógica de limpieza aquí
    process.exit(0);  // Terminar el proceso de manera ordenada
  });
  
  process.on('SIGQUIT', () => {
    console.log('SIGQUIT recibido, guardando los backups...');
    backupDatabaseToSqlScript()
    backupDatabaseToJson()
    process.exit(0);  // Terminar el proceso de manera ordenada
  });
  
  process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, guardando los backups...');
    backupDatabaseToSqlScript()
    backupDatabaseToJson()
    process.exit(0);  // Terminar el proceso de manera ordenada
  });
  