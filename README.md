# GoFood - RESTful API

API Creada para el desarrollo e implementación del Proyecto GoFood

## Correr la app:

Correr los siguientes comandos:

- Instalar los paquetes npm dependencias de la app: `npm install`

Diferentes entornos:
- Local Environment: `npm start`
- Dev Server Environment: `npm run start:dev`
- Production Environment: `npm run start:prod`
- Debug Environment: `ndb server.js`

Si tienes una base de datos localmente el mejor entorno es el local, recordar instalar la dependencia de [PostGIS](https://postgis.net/documentation/getting_started/) para tu PostgreSQL, esta dependencia funciona para almacenar puntos geográficos como ser la ubicación del usuario.

El servidor correrá en este endpoint [http://localhost:3000](http://localhost:3000)  

Para realizar solicitudes a la API por favor revisa la documentación en Postman con el siguiente link:
[https://documenter.getpostman.com/view/23604933/2s9YR83CYb](https://documenter.getpostman.com/view/23604933/2s9YR83CYb)