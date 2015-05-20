var ports = [],
	broadcast = function(message,id,clients){
		clients = clients===undefined?ports:clients;
		if(clients !== undefined){
			for(var i=0;i<clients.length;i++){
				if(i != id && clients[i] !== undefined){
					clients[i].postMessage(message);
				}
			};
		}
	};
onconnect = function(e){
	e.ports.forEach(function(port){
		var id = (function(){
			for(var i=0;i<ports.length;i++){
				if(ports[i] === undefined){
					ports[i] = port;
					return i;
				}
			}
			return ports.push(port) - 1;
		})();
		port.onmessage = function(e){
			var clients = e.data.id===undefined?ports:[ports[e.data.id]];
			switch(e.data.cmd){
				case 'id':case 'connect':break;// No spoofing allowed!
				case 'close':
					delete ports[e.data.id];
				default:
					broadcast(e.data,id,clients);
			}
		};
		port.start();
		port.postMessage({
			cmd: 'id',
			id: id
		});
		broadcast({
			cmd: 'connect',
			id: id
		});
	});
};