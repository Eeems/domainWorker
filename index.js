(function(global,undefined){
	var setup = function(){
			var pageid = document.getElementById('page-id'),
				worker = new SharedWorker('./sharedworker.js'),
				port = worker.port,
				id;
			worker.onerror = function(e){
				console.error(e);
			};
			port.onmessage = function(e){
				console.log(e.data);
				switch(e.data.cmd){
					case 'reload':
						location.reload();
					break;
					case 'go':
						location.assign(e.data.location);
					break;
					case 'connect':
						if(id == e.data.id){
							// Handle connecting
						}else{
							// Handle another page connecting
						}
					break;
					case 'id':
						pageid.value = domainWorker.id = id = e.data.id;
					break;
				}
			};
			global.domainWorker = {
				port: port,
				id: id,
				send: function(data){
					port.postMessage(data);
				},
				cmd: function(cmd,data){
					data = data===undefined?{}:data;
					data.cmd = cmd;
					port.postMessage(data);
				},
				close: function(){
					global.domainWorker.send({
						cmd: 'close',
						id: id
					});
					pageid.value = '';
				}
			};
			document.getElementById('button-new').onclick = function(){
				window.open(location.href);
			};
			document.getElementById('button-reload').onclick = function(){
				global.domainWorker.cmd('reload');
			};
			document.getElementById('button-google').onclick = function(){
				global.domainWorker.cmd('go',{
					location: 'http://google.com/'
				});
			};
			document.getElementById('button-disconnect').onclick = function(){
				global.domainWorker.close();
				var els = document.getElementsByTagName('button'),
					i;
				for(i=0;i<els.length;i++){
					if(els[i].id != 'button-new'){
						els[i].onclick = function(){};
					}
				}
			};
		},
		close = function(){
			domainWorker.close();
		};
	try{
		addEventListener('beforeunload',close);
		addEventListener('load',setup);
	}catch(e){
		console.error(e);
		attachEvent('onbeforeunload',close);
		attachEvent('onload',setup);
	}
})(window);