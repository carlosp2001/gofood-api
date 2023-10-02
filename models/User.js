const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const validator = require('validator');
const bcrypt = require(bcrypt);

const User = sequelize.define('User', {
    first_name: {
      type: DataTypes.STRING(70),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'El primer nombre es obligatorio'
        },
        len: {
          args: [1, 70],
          msg: 'El primer nombre debe tener entre 1 y 70 caracteres'
        }

      }

    },
    last_name: {
      type: DataTypes.STRING(70),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'El apellido es obligatorio'
        },
        len: {
          args: [1, 70],
          msg: 'El apellido es obligatorio'
        }

      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'El correo electrónico ya esta en uso'
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'El correo electrónico no es válido.'
        },
        notEmpty: {
          args: true,
          msg: 'El campo de correo electrónico es obligatorio.'
        },
        isLowerCase: function(value) {
          if (!validator.isLowercase(value)) {
            throw new Error('El correo electrónico debe estar en minúsculas.');
          }
        }
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        this.setDataValue('password', hashedPassword);
      }
    },
    passwordChangedAt: {
      type: DataTypes.DATE
    },
    passwordResetToken: {
      type: DataTypes.STRING
    },
    passwordResetExpires: {
      type: DataTypes.DATE
    }
  },
  {
    defaultScope: {
      attributes: { exclude: ['password'] }
    }
  });

// Hook para transformar el correo a minúsculas antes de la validación
User.beforeValidate((instance, options) => {
  if (instance.email) {
    instance.email = instance.email.toLowerCase();
  }
});

// Metodo para validar la contraseña, se debe utilizar en el controlador al
// al momemento de validación
User.prototype.passwordValidation = function(password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = User;