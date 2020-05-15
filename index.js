//modulo principal ( main() ) 
// joropo chat
//en este modulo descargamos todas las api requeridas por el sistema
//'use strict'; //habilitamos modo estricto
var express = require ('express'); // invocamos la api express
var app1 = express(); // utilizamos el objeto express
const helmet = require('helmet'); //modulo de seguridad recomendado
var path = require("path"); // para utilizar ciertas funciones de ruta
var https = require('https'); // para usar protolo https
var fs = require('fs'); // manejo de archivos
var MongoClient = require('mongodb').MongoClient; // cliente base de datos
var ObjectId = require('mongodb').ObjectID; //funcion para el Id de los documentos
var bodyParser = require ('body-parser'); //modulo para transmision de datos post

// support parsing of application/json type post data
app1.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app1.use(bodyParser.urlencoded({ extended: true }));
//proteger express con helmet
app1.use(helmet());
var DbManager = require ('./dbmanager.js');
var objServidorExpress = require('./staticserver.js'); // modulo servidor estatico
var moduloservidorExpress = new objServidorExpress ( 3000, 
														path.join(__dirname , '/www'),
														path.join(__dirname , '/www/error404/error.html'));

//arrancamos nuestros servidores
moduloservidorExpress.https = true; //activamos modulo https
moduloservidorExpress.ruta = "/login";
moduloservidorExpress.iniServidor ( app1, express, https,
												fs, 'key.pem',  'cert.pem' );

//definimos los parametros para el objeto de base de datos
var DBurl = "mongodb://localhost:27017/";
miDb = new DbManager ( DBurl ,'prueba');
DbDocumento =  {
	login : null,
	password : null
} ;// fin mdocumento


//var io = require('socket.io')(moduloservidorExpress.server); // socket io para validar mensajes en tiempo real


app1.post(moduloservidorExpress.ruta,
 (req, res) => {
console.log ('metodo post');
//recuperamos los campos de formulario
//login y password
var loginDetails = {    
    username : req.body.login,    
    password : req.body.password    
};
console.log('usuario: ' + loginDetails.username + '\nClave: ' + 
				loginDetails.password);
})



function objToString (objeto) {
		//convierte un array obj en cadena JSON
objeto.forEach((item, index, arr) => {
			 console.log ('Documento: ' + (index + 1)  + ' ' + JSON.stringify (item));
			 } );    	 
}

function mostrarPropiedades(objeto, nombreObjeto) {
  var resultado = ``;
  for (var i in objeto) {
    //objeto.hasOwnProperty se usa para filtrar las propiedades del objeto
    if (objeto.hasOwnProperty(i)) {
        resultado += `${nombreObjeto}.${i} = ${objeto[i]}\n`;
    }
  }
  return resultado;
}

function listaTodasLasPropiedades(o){
   var objetoAInspeccionar;
   var resultado = [];

   for(objetoAInspeccionar = o; objetoAInspeccionar !== null; objetoAInspeccionar = Object.getPrototypeOf(objetoAInspeccionar)){
      resultado = resultado.concat(Object.getOwnPropertyNames(objetoAInspeccionar)) + "\n";
   }   

   return resultado; 
}