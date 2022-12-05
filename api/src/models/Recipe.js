const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue:DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    healthScore:{
      type: DataTypes.INTEGER
    },
    summary:{
      type: DataTypes.STRING
    },
    steps:{
      //los pasos se guardan en un array dependiendo en que orden sera 
      //el orden de pasos 
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
    ,
    img:{
      type: DataTypes.STRING
    }
  });
};
