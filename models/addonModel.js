const sequelize = require('../utils/db');
const { UUID, UUIDV4, DataTypes } = require('sequelize');

const Restaurant = require('./restaurantModel');

const Addon = sequelize.define('Addon', {
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
        args: [1, 100],
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
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'El precio del complemento es obligatorio',
      },
      notNull: {
        args: true,
        msg: 'El precio del complemento es obligatorio',
      },
      validateDecimal: function (value) {
        if (!/^\d{1,4}\.\d{2}$/.test(value))
          throw new Error(
            'El numero debe contener máximo 5 números y 2 después del punto'
          );
      },
    },
  },
  restaurantId: {
    type: DataTypes.UUID,
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
  addonCategoryId: {
    type: DataTypes.UUID,
    validate: {
      addonCategoryExists: async function (value) {
        if (!value) {
          throw new Error('La categoria del complemento es obligatoria');
        } else {
          const addonCategory = await AddonCategory.findByPk(value);
          if (
            !addonCategory ||
            this.restaurantId !== addonCategory.restaurantId
          )
            throw new Error('La categoria del complemento no existe.');
        }
      },
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
  },
});

const AddonCategory = sequelize.define('AddonCategory', {
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
        msg: 'El nombre de la categoría es obligatorio',
      },
      len: {
        args: [1, 100],
        msg: 'El nombre de la categoría debe tener entre 1 y 100 caracteres',
      },
      notEmpty: {
        args: true,
        msg: 'El nombre de la categoría es obligatorio',
      },
    },
  },
  restaurantId: {
    type: DataTypes.UUID,
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

// Relaciones de la tabla de Complementos
Addon.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
});

Addon.belongsTo(AddonCategory, {
  foreignKey: 'addonCategoryId',
});

// Relaciones de la tabla de categoria de complementos
AddonCategory.belongsTo(Restaurant, {
  foreignKey: 'restaurantId',
});

module.exports = { Addon, AddonCategory };
