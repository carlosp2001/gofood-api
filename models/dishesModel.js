const sequelize = require('../utils/db');
const { UUID, UUIDV4, DataTypes } = require('sequelize');

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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
  },
});
