module.exports = function ( fnPuerto , fnDirhtml, fnDirError404 ) {
	//definimos las propiedades de nuestro objeto
	this.puerto = fnPuerto;
	this.directory = fnDirhtml; // directorio estatico		
	this.errorDirectory = fnDirError404;
	this.https = false; //true activa https
	this.ruta = "/";
	this.iniServidor = function ( objetoapp, objexpress, objetohttps,
										objetofs, archivokey,  archivocert ) {
	//arrancar servidor express sin certificados ssl
	// parametro objetoapp es la variable app de express
	// parametro objexpress es el objeto express()
	that = this;	
	if ( !this.https ) {
		//arranca serv http
		
		this.server = objetoapp.listen(this.puerto, function() {
		console.log('Iniciando servidor HTTP en puerto ' + that.server.address().port);
		});}
	else {
		//arranca serv https
		this.server = objetohttps.createServer({
			key: objetofs.readFileSync(archivokey),
			cert: objetofs.readFileSync(archivocert)
			}, objetoapp).listen(this.puerto, function(){
   				console.log('Iniciando servidor HTTPS en puerto ' + that.server.address().port);
					});
		}

	objetoapp.use(this.ruta, objexpress.static(this.directory));
	dirErr = this.errorDirectory;
	objetoapp.use('*', objexpress.static(this.errorDirectory));
	//objetoapp.use('*', function(req, res){
		//cualquier otra peticion a localhost 
		//es redirigida a la pagina de error
  	//res.sendFile(dirErr);
  	//res.end;
	//);
	}
}
