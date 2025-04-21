import mongoose from 'mongoose';
import  iotdb_2 from "../bd/iiot11_bd_2.js"

// Definimos el esquema con los campos correctos
const MeasurementSchema = new mongoose.Schema({
  id: { type: String, required: true }, 
  t: { type: String, required: true },  
  h: { type: String, required: true },  
  p: { type: String, required: true }, 
}, { timestamps: false});  // si necesitamos esto lo agregariamos para el timestamp que pide

// Crear el modelo de Mongoose basado en el esquema
const Measurement= mongoose.model('measurements', MeasurementSchema );

export default Measurement;