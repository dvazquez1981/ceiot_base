import {iotdb_1} from '../bd/iiot11_bd_1.js'
import {Sequelize, DataTypes} from 'sequelize'

/** Defino modelo de los datos */
const User = iotdb_1.define('users',{

    user_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
  
    name:{
        type: DataTypes.STRING,
           },
    
    key:{
       type: DataTypes.STRING,
                  }
      
} , {
    tableName: 'users',
    timestamps: false
});


export default User;