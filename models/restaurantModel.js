const { DataTypes, UUID, UUIDV4 } = require('sequelize');
const sequelize = require('../utils/db');
const validator = require('validator');

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El nombre del restaurante es obligatorio',
      },
      len: {
        args: [1, 70],
        msg: 'El nombre del restaurante debe tener entre 1 y 100 caracteres',
      },
      notEmpty: {
        args: true,
        msg: 'El nombre del restaurante es obligatorio',
      },
    },
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: true,
    validate: {
      validateImages: function (value) {
        if (value && value.length > 5) {
          throw new Error('No se permiten más de 5 imágenes');
        }
      },
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isValidHonduranPhoneNumber(value) {
        if (value && !/^\+504\d{8}$/.test(value)) {
          throw new Error(
            'El número de teléfono debe tener el formato +50412345678.'
          );
        }
      },
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
  },
});

module.exports = Restaurant;
