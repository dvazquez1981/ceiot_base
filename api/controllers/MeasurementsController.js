import Measurement from '../models/Measurements.js';
import Device from '../models/Device.js'
import  render from "../render.js";
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;
/** Obtener todos los MeasurementS */

export async function getAll(req, res) {
    try {
        const Measurements = await Measurement.find(); 
        if (Measurements.length > 0) {
            res.status(200).json(Measurements);
        } else {
            res.status(404).json({ message: 'No se encontraron mediciones.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/** Obtene por ID */
export async function getAllByIdDevice(req, res) {
    const { id } = req.params;

    console.log("device id    : " + req.body.id + " key         : " + req.body.key + " temperature : " + req.body.t + " humidity    : " + req.body.h);	
  
    
    try {
        const m = await Measurement.findOne({ id:id }); 
        if (m) {
            res.status(200).json(m);
        } else {
            res.status(404).json({ message: 'La medicion no fue encontrada no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Algo salió mal', error: error.message });
    }
}


/** Crear un nuevo measurement */
/*validando los valores del body*/
export async function createMeasurement(req, res) {
    const { id, key, t, h } = req.body;

    console.log("device id    : " + id+ " key         : " + key + " temperature : " + t + " humidity    : " + h);	
 
     
    // Validar que todos los campos requeridos están presentes
    if (!id || !t || !h)  {
        return res.status(400).json({ message: 'device_id, key, t y h son obligatorios',
            status: 0 });
    }


    try {

        
   //Validar que temperatura y humedad sean números, incluso si son strings que representan números
   if (Number.isNaN(Number(t)) || Number.isNaN(Number(h))) {
    return res.status(422).json({
      message: 'temperatura  y humedad  deben ser números.',
      status: 0,
    });
    }

    //-50 a 100 grados
    let temperatura=Number(t)
    if (temperatura < -50 || temperatura > 100) { 
        return res.status(422).json({
            message: 'La temperatura (t) debe estar entre -50 y 100 grados.',
            status: 0,
        });
    }

   //0 a 100 
   let humedad=Number(h)

  // Validar que h esté en un rango de humedad válido, por ejemplo, entre 0 y 100
   if (0>humedad  || humedad > 100) {
    return res.status(422).json({
      message: 'La humedad (h) debe estar entre 0 y 100%.',
      status: 0,
    });
  }

    const DeviceFound = await Device.findOne({
        where: {
            device_id: id
        }
      });

     if (!DeviceFound)
     {
        return res.status(422).json({ message: 'El device_id no es correcto.' });

     }
        // Crear el nuevo dispositivo
        const newMeasurement = new Measurement({ id, t, h });
        await newMeasurement.save();
        const insertedId = newMeasurement._id;
    
        //return { insertedId };
        return res.status(201).json({ insertedId });
    } catch (error) {
        console.error('Error al crear la medicion:', error);
        return res.status(500).json({ message: 'Ocurrió un error inesperado', error: error.message });
    }
}

/** Obtener por id */

export async function getOneHtml(req,res)
{
    
    var {id,t,h}  = req.params;
    
    // Validar que todos los campos requeridos están presentes
    if (!id || !t || !h)  {
        return res.status(400).json({ message: 'device_id, t y h son obligatorios',
            status: 0 });
    }




    console.log("device id    : " + id + " temperature : " + t + " humidity    : " + h);	
 
                var template = "<html>"+
                "<head>Sensor id: <title>Sensor {{id}}</title></head>" +
                "<body>" +
           "<h1>{{ id }}</h1>"+
           "temperatura: {{ t}}<br/>" +
           "humedad: {{ h }}" +
                "</body>" +
           "</html>";


    try {
             // Verificar si el ID es válido
   

        const m = await Measurement.findOne( {id: id, 
            t: t, 
            h: h 
        });
          
        
        if(m){
         
            console.log(m);
            res.send(render(template,{id: m.id, t: m.t, h: m.h}));




        }else{
            res.status(404).json({
                message: 'No se encuentra la medicion.'      
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message:'Algo salio mal',
            data:{error}
        });
    }
        
}

export async function getAllHtml(req,res)
{

   
        // Obtener todos los dispositivos
        try {
            const Measurements = await Measurement.find(); 
            if (Measurements.length > 0) {
              
        // Crear el HTML para cada medida usando map
        var  measurementsRows = Measurements.map(function(m) {
            console.log(m); // Ver el dispositivo en la consola
            return '<tr><td><a href="/web/measurement/'  + m.id + '&' + m.t + '&' + m.h + '">' + m.id + '</a></td>' +
            '<td>'  + m.t +'</td>' +
            '<td>' +  m.h + '</td></tr>';



            return '<td>' + m.id + '</td> <a href="/web/measurement/' + m.id + '&' + m.t + '&' + m.h + '">' + m._id + '</a>' +
    
            '<td>' + m.t + '</td>' +
            '<td>' + m.h + '</td></tr>';
     }).join('');
    // para combinar los elementos del array en un solo string

        // Enviar el HTML de la respuesta
        res.send("<html>" +
                 "<head><title>Sensores</title></head>" +
                 "<body>" +
                    "<table border=\"1\">" +
                       "<tr><th>Sensor id </th><th>temperatura </th><th>humedad </th></tr>" +
                       measurementsRows+ // Usamos el HTML generado dinámicamente
                    "</table>" +
                 "</body>" +
             "</html>");

              





            } else {
                res.status(404).json({ message: 'No se encontraron mediciones.' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }


    }
