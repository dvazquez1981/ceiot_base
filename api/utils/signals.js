import {backupDatabaseToSqlScript} from '../bd/iiot11_bd_1.js'
import {backupDatabaseToJson} from '../bd/iiot11_bd_2.js'




// Manejadores para señales de terminación
process.on('SIGINT', async () => {
    console.log('SIGINT guardando los backups...');
    await backupDatabaseToSqlScript()
    await backupDatabaseToJson()
    
    process.exit(0);  
  });
  
  process.on('SIGQUIT', async () => {
    console.log('SIGQUIT recibido, guardando los backups...');
    await backupDatabaseToSqlScript()
    await backupDatabaseToJson()
    process.exit(0);  
  });
  
  process.on('SIGTERM', async () => {
    console.log('SIGTERM recibido, guardando los backups...');
    await backupDatabaseToSqlScript()
    await backupDatabaseToJson()
    process.exit(0);  
  });
  