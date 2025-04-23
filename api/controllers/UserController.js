import User from '../models/User.js'
import {sanitize} from '../utils/sanitize.js'

/** Obtener todos los Devices*/
export async function getAll(req,res,next){

    try {
        
        console.log('Obtengo todas los usuarios ');
        const u= await  User.findAll();        
        if(u){
          
            res.status(200).json(sanitize(u));
        }

      
  
      } catch (error) {
        console.log(error.message );
        res.status(500).json({ error: error.message });
      }
    }

/** Obtener por id */
export async function getOne(req,res)
{
    
    var {user_id}  = req.params;
        
    try {
        console.log('Obtengo el usuario: '+user_id);
        const UserFound = await  User.findOne({
            where: {
                user_id:user_id
            }
        });

        if( UserFound){
            
            res.status(200).json(sanitize(UserFound));

        }else{
            console.log('No se encuentra el user.');
            res.status(404).json({
                message: 'No se encuentra el user.'      
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message:'Algo salio mal',
            data:{error}
        });
    }
}

/* crear User */
export async function crearUser(req, res) 
 {
    const {user_id ,name,key} = req.body;
   
    // Validar que todos los campos requeridos están presentes
    if (!(user_id && name && key)){

        console.log('User_id, name, key son obligatorios');
        return res.status(400).json({
            message: 'User_id, name, key son obligatorios',
            status: 0,
        });
    }

    try {
        // Verificar si user ya existe
        const existingUser= await  User.findOne({
            where: {
                user_id: user_id
            }
          });

        if (existingUser) {
            console.log('El User ya existe. Elige un User_id distinto.');
            return res.status(409).json({
                message: 'El User ya existe. Elige un User_id distinto.',
                status: 0,
            });
        }

        // Crear un nuevo User
        const newUser= await User.create({
            user_id:user_id,
            name: name,
            key:key
        });
        console.log('User creado con éxito.');
        return res.status(201).json({
            message: 'User creado con éxito.',
            status: 1,
            data: sanitize(newUser)
        });
    } catch (error) {
        console.error('Error al crear el User:', error);
        return res.status(500).json({
            message: 'Ocurrió un error inesperado.',
            status: 0,
            error: error.message,
        });
    }
};



/** borra Device*/
export async function deleteUser(req, res)
{


const {user_id}= req.params;
 try {

  await User.destroy({
        where: {
            user_id:user_id
        }})
        .then(function (deletedRecord) {
            if(deletedRecord > 0)
            {
                console.log("Se borro correctamente");
                res.status(200).json({message: "Se borro correctamente"});          
            }
            else
            {   console.log("No existe registo");
                res.status(404).json({message: "no existe registo"})
            }
        })

} catch (error) {

    console.log('Hubo un error');
    res.status(500).json({
        message:'Hubo un error',
        data:{error}
    });
}
}

/** actualizar Device*/
export async function updateUser(req,res){

    var {user_id}  = req.params;
    const {name,key}= req.body;


    try {

           await User.findOne({
            where: {
                user_id :user_id
                   },
            attributes: [ 'user_id',
                'name',
                'key'
                    ]
          })
          .then( async u=> {

               // Si u es null, se responde con un error 404
                if (!u) {

                    console.log('User no encontrado.');
                return res.status(404).json({
                    message: 'User no encontrado.'
                     });
                 }

                 // Si device no es null, actualizamos  en la base de datos
                 await u.update({  
                    user_id:user_id,
                    name:name || u.name ||  null,
                    key:key|| u.key|| null
                 
                   });

                   console.log('User actualizo correctamente.');
                 // Si la actualización es exitosa, respondemos con éxito
                res.status(200).json({
                message: 'User actualizo correctamente.'
                });
          });
        
    } catch (error) {

        console.log(error)
        res.status(500).json({
            message:'Algo no funciono',
            data:{error}
        });
    }

}

