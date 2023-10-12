const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El nombre es obligatorio'
        },
        len: {
          args: [1, 70],
          msg: 'El primer nombre debe tener entre 1 y 100 caracteres'
        }

      }

    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: true
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
        notNull: {
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
      allowNull: true
    },
    passwordChangedAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    passwordResetToken: {
      allowNull: true,
      type: DataTypes.STRING
    },
    passwordResetExpires: {
      allowNull: true,
      type: DataTypes.DATE
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isLength: {
          args: [5, 100],
          msg: 'La dirección debe tener entre 5 y 100 caracteres.'
        }
      }
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true

    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: {
        notNull: {
          msg: 'Debe agregarse un rol al usuario'
        },
        isIn: {
          args: [['superadmin', 'admin', 'user', 'kitchen', 'driver']]
        }
      }

    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debe agregarse un proveedor al usuario'
        },
        isIn: {
          args: [['google', 'email', 'facebook']]
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now()
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidHonduranPhoneNumber(value) {
          if (value && !/^\+504\d{8}$/.test(value)) {
            throw new Error('El número de teléfono debe tener el formato +50412345678.');
          }
        }
      }
    }
  }
  // {
  //   defaultScope: {
  //     attributes: { exclude: ['password'] }
  //   }
  // }
);

////////////////////////////////////////////////////////////
// Hooks

// Hook para transformar el correo a minúsculas antes de la validación
User.beforeValidate((instance, options) => {
  if (instance.email) {
    instance.email = instance.email.toLowerCase();
  }
});

// Hook antes de crear un nuevo registro del Usuario
User.beforeCreate(async (user, options) => {
  if (user.password)
    user.password = await bcrypt.hash(user.password, 10);
});

// Hook antes de actualizar el usuario en la base de datos
User.beforeUpdate(async (user, options) => {

  // Verifica si el campo de contraseña ha cambiado
  if (user.changed('password')) {
    console.log('cambiando contraseña');
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
      user.passwordChangedAt = Date.now();

    }

  }
});

/////////////////////////////////////////////////////////////
// Métodos para el modelo
// Metodo para validar la contraseña, se debe utilizar en el controlador al
// al momemento de validación
User.prototype.passwordValidation = function(password) {
  return bcrypt.compareSync(password, this.password);
};

User.prototype.createPasswordResetToken = function() {
  const resetCode = Math.random()
    .toString(36)
    .substr(2, 4)
    .toUpperCase();

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  console.log(resetCode, this.passwordResetToken);

  const now = new Date();
  this.passwordResetExpires = new Date(now.getTime() + 10 * 60 * 1000);

  return resetCode;
};

User.prototype.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

module.exports = User;