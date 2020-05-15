const bcrypt = require("bcryptjs"); // modulo para crear hash

module.exports =  function (url, dbName) { 
	//definimos el objeto para manejo de bases de datos
	this.url = url;
	this.dbName = dbName;
	this.password = ''; // cadena password
	this.ValidPass = false; //true establece que el usuario esta autenticado
	this.conectar = ( ObjMongoClient ) => { // funcion flecha open 
		//asignamos la url de la base de datos mongodb
    return new Promise((resolve,reject) => {
    		//creamos una promesa para la apertura de la base de datos
        ObjMongoClient.connect(this.url,{ useUnifiedTopology: true }, (err,client) => { //Use "client" insted of "db" in the new MongoDB version
            if (err) {  //manejo de errores - se usa con catch
                reject(err)
            } else {
            	  console.log ('Conexion abierta en url: %s', this.url );
                resolve({
                       client //devuelve el objeto client con la data de mongodb
                });
            };
        });
    });
		}; // fin de metodo conectar()
		this.desconectar = (client) => {
    return new Promise((resolve,reject) => {
        //resolve(client.close());
        client.close( (data, err) => { 
				if (err) {
						reject (err)} 
			  else {
        		resolve (data)}
        		});
        
    }).catch (console.log ('Conexion cerrada'))
		} // fin metodo desconectar()
		this.agregarDocumento = (client, coleccion, esquema) => { //funcion create - parametro client
    return new Promise((resolve,reject) => {
    	//crea una nueva promesa e incluye un nuevo documento 
        db = client.db(this.dbName); //Get the "db" variable from "client"
        db.collection(coleccion).insertOne(esquema , (err,result)=> {
                if(err){reject(err)}
                else {
                		//console.log (result);
                    resolve({
                        id: result.ops[0]._id, //Add more variables if you want
                        client
                    });
                }

            });
    });
		}; // fin de agregarDocumento
		this.encrypt = ( txtPassword  ) => {
				return new Promise ((resolve, reject) => {
					resolve (bcrypt.hash(txtPassword, 8 ));
  						}); 
 		} // fin metodo password
 		this.decrypt = () => {
 				return new Promise ((resolve, reject) => {
					resolve(bcrypt.compare("frase", this.password)); // true
   				
  				}); 
 		}; // fin metodo decrypt
		this.listAll = (client, coleccion) => {
					return new Promise ((resolve, reject) => {
					//creamos una promesa para mostrar todos los 
					//documentos
						db = client.db(this.dbName);
  					db.collection(coleccion).find({}).toArray((err, docs) => {
    					if (err) {
        					reject(err);
    					}
    					else {
    							//console.log('funcion ' + docs);
    							resolve (docs);
			 								 
    					}
					});// fin collection.find
					 //fin resolve
					});
		} // fin metodo listAll
		this.listOne = (client, coleccion, queryString) => {
					return new Promise ((resolve, reject) => {
					//creamos una promesa para mostrar el primer 
					//documento coincidente
						db = client.db(this.dbName);
  					db.collection(coleccion).find( queryString ).toArray((err, docs) => {
    					if (err) {
        					reject(err);
    					}
    					else {
    							//console.log('funcion ' + docs);
    							resolve (docs);
			 								 
    					}
					});// fin collection.find
					 //fin resolve
					});
		} // fin metodo listAll



} //fin DbManager

