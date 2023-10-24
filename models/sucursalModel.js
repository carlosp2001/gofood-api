const { DataTypes, UUID, UUIDV4, Op } = require('sequelize');
const slugify = require('slugify');
const sequelize = require('../utils/db');
const validator = require('validator');
const Restaurant = require('./restaurantModel');

const Sucursal = sequelize.define('Sucursal', {
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
        msg: 'El nombre de la sucursal es obligatorio',
      },
      len: {
        args: [1, 70],
        msg: 'El nombre de la sucursal debe tener entre 1 y 100 caracteres',
      },
      notEmpty: {
        args: true,
        msg: 'El nombre de la sucursal es obligatorio',
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
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'Debe agregarse una dirección a la sucursal',
      },
      notNull: {
        msg: 'La sucursal debe contar con una dirección',
      },
    },
  },
  slug: {
    type: DataTypes.STRING,
    validate: {
      slugExists: async function (value) {
        if (!value) {
          throw new Error('El slug es obligatorio');
        } else {
          const sucursal = await Sucursal.findOne({
            where: {
              [Op.and]: [{ slug: value }, { id: { [Op.not]: this.id } }],
            },
          });
          if (sucursal) throw new Error('El nombre debe ser único');
        }
      },
    },
    unique: {
      args: true,
      msg: 'El nombre debe ser único',
    },
  },
  // location: {
  //   type: DataTypes.GEOMETRY('POINT'),
  //   allowNull: true
  //
  // },
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
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: false,
    validate: {
      restaurantExists: async function (value) {
        if (!value) {
          throw new Error('El restaurante es obligatorio');
        } else {
          const restaurant = await Restaurant.findByPk(value);
          if (!restaurant)
            throw new Error('El restaurante seleccionado no existe.');
        }
      },
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
  },
});

Sucursal.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
});

// Hook que se ejecuta antes de comenzar la validación
Sucursal.beforeValidate(async (sucursal) => {
  if (sucursal.name) sucursal.slug = slugify(sucursal.name, { lower: true });
});

const addSlug = async (sucursal, isUpdating) => {
  let slug;
  if (sucursal.name) slug = slugify(sucursal.name, { lower: true });
  let queryResult;
  if (isUpdating) {
    console.log('Hola');
    queryResult = await Sucursal.findOne({
      where: {
        [Op.and]: [{ slug: slug }, { id: { [Op.not]: sucursal.id } }],
      },
    });
  } else {
    queryResult = await Sucursal.findOne({ where: { slug } });
  }
  if (queryResult) throw new Error('El nombre debe ser único');
  sucursal.slug = slug;
};

module.exports = Sucursal;
