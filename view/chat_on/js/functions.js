$(document).ready(function(){	var janelas = new Array();	function add_janelas(id, nome){		var html_add = '<div class="janela" id="jan_'+id+'"><div class="topo" id="'+id+'"><span>'+nome+'</span><a href="javascript:void(0);" id="fechar">X</a></div><div id="corpo"><div class="mensagens"><ul class="listar"></ul></div><input type="text" class="mensagem" id="'+id+'" maxlength="255" /></div></div>';		$('#janelas').append(html_add);	}		function abrir_janelas(x){		$('#contatos ul li a').each(function(){			var link = $(this);			var id = link.attr('id');			if(id == x){				link.click();			}		});	}	var antes = -1;	var depois = 0;	//var notificacao = 0;	var ultima_msg = "";	function verificar(){		//alert("verificar");		var users = new Array();		beforeSend: antes = depois;				$('#contatos ul li a').each(function(){			var id_u = $(this).attr('id');			users.push(id_u);		});		var u_online = $('span.online').attr('id');		users.push(u_online);						$.post('../view/chat_on/sys/chat2.php', {acao: 'verificar', ids: janelas, users: users}, function(x){			if(x.nao_lidos != '' || x.nao_lidos != undefined){				var arr = x.nao_lidos;				for(i in arr){					abrir_janelas(arr[i]);				}			}						if(janelas.length > 0){				var mens = x.mensagens;								if(mens != ''){					for(i in mens){						//$('#jan_'+i+' ul.listar').html(mens[i]);						$('#jan_'+i+' ul.listar').html(mens[i]).animate({scrollTop:$('#jan_'+i+' ul.listar').height()*1000}, 500);												//if(notificacao == 0){						//console.log("ultima "+ultima_msg);						//console.log("atual "+x.last_msg[i]);						if(ultima_msg != x.last_msg[i]){							Notification.requestPermission(function(permission){								//exemplo de notificação com o corpo da mensagem								//var notification = new Notification("Nova Mensagem", {body:"Nova mensagem de "+x.enviado_por+": "+x.last_msg[i-1], icon:'../images/icone_notifications.png'});								var notification = new Notification("Nova Mensagem", {body:"Nova mensagem de "+x.enviado_por, icon:'../images/icone_notifications.png'});								notification.onshow = function(){									playChat();//inicia o som de alerta								}								notification.onclose = function(){									stopChat();//finaliza o som de alerta								}								notification.onclick = function(){									 window.focus();									stopChat();//finaliza o som de alerta								}																setTimeout(function(){									notification.close(); //fecha a notificação								},5000);							});							//notificacao = 1;							ultima_msg = x.last_msg[i];						}					}				}			}			var users_onlines = x.useronoff;			for(i in users_onlines){				$('#contatos ul li span#'+i+'').removeClass('on off aus').addClass(users_onlines[i]);			}			depois += 1;					}, 'jSON');			}	verificar();		$('body').on('click', '.janela', function(){		var id = $(this).children('.topo').attr('id');				$.post('../view/chat_on/sys/chat2.php',{acao: 'mudar_status', user: id});		$(document).ready(function() {			document.title = 'Admed Sistemas';		});		//notificacao = 0;	});		$('body').on('click', '.comecar', function(){		var id = $(this).attr('id');		var nome = $(this).attr('nome');		if(nome.length > 24){			nome = nome.substring(0,24)+"...";		}		janelas.push(id);		for(var i = 0; i < janelas.length; i++){			if(janelas[i] == undefined){				janelas.splice(i, 1);				i--;			}		}				add_janelas(id, nome);				$(this).removeClass('comecar');		verificar();		return false;	});		$('body').on('click', 'a#fechar', function(){		var id = $(this).parent().attr('id');		var parent = $(this).parent().parent().hide();		$('#contatos a#'+id+'').addClass('comecar');				var n = janelas.length;		for(i = 0; i < n; i++){			if(janelas[i] != undefined){				if(janelas[i] == id){					delete janelas[i];					$(document).ready(function() {						document.title = 'Admed Sistemas';					});				}			}		}	});		$('body').delegate('.topo', 'click', function(){		var pai = $(this).parent();		var isto = $(this);				if(pai.children('#corpo').is(':hidden')){			isto.removeClass('fixar');			pai.children('#corpo').toggle(100);		}else{			isto.addClass('fixar');			pai.children('#corpo').toggle(100);		}	});		chat_interval = setInterval(function(){				if(antes != depois){			verificar();					}	}, 10000);	//console.log(chat_interval);})