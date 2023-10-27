const sequelize = require('../utils/db');
const { UUID, UUIDV4, DataTypes } = require('sequelize');

const { Addon } = require('./addonModel');

const Dish = sequelize.define('Dish', {
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
        msg: 'El nombre del platillo es obligatorio',
      },
      len: {
        args: [1, 70],
        msg: 'El nombre del platillo debe tener entre 1 y 100 caracteres',
      },
      notEmpty: {
        args: true,
        msg: 'El nombre del platillo es obligatorio',
      },
    },
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: true,
    validate: {
      validateImages: function (value) {
        if (value && value.length > 1) {
          throw new Error('No se permiten más de 1 imagen');
        }
      },
    },
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'El precio del platillo es obligatorio',
      },
      notNull: {
        args: true,
        msg: 'El precio del platillo es obligatorio',
      },
      validateDecimal: function (value) {
        if (!/^\d{1,4}\.\d{2}$/.test(value))
          throw new Error(
            'El numero debe contener máximo 5 números y 2 después del punto'
          );
      },
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
  },
});

const DishesAddons = sequelize.define('DishesAddons', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
});

Dish.belongsToMany(Addon, { through: DishesAddons });
Addon.belongsToMany(Dish, { through: DishesAddons });

module.exports = Dish;
