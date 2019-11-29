function toast(message, time) {
  var toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'show';
  toast.innerHTML = message;
  document.body.appendChild(toast);

  setTimeout(function(){ 
	document.body.removeChild(toast); 
  }, time != null ? time : 3000);
} 

function snackbar(message, time) {
  var snackbar = document.createElement('div');
  snackbar.id = 'snackbar';
  snackbar.className = 'show';
  snackbar.innerHTML = message;
  document.body.appendChild(snackbar);	

  setTimeout(function(){ 
	document.body.removeChild(snackbar); 
  }, time != null ? time : 3000);
} 

function remove(id) {
  var element = document.getElementById(id);
  document.body.removeChild(element); 
}	

function alert(title, message) {
	var alert = document.createElement('div');
	alert.id = 'rl_alert';
	alert.innerHTML = '<div class="fade show"><div class="rl-alert"><span class="rl-alert-header">'+title+'</span><span class="rl-alert-content">'+message+'</span><div class="rl-alert-footer"><span onclick="remove(\'rl_alert\');" class="rl-alert-option">OK</span></div></div></div>';
	document.body.appendChild(alert);
}

function busca(){
  var input_cep = document.getElementById('input_cep');
  var cep = input_cep.value;

  var url = 'https://viacep.com.br/ws/'+cep+'/json/';
  console.log('fetching: '+url);

  fetch(url)
  .then(response => {
    if(response.status === 200){
      toast('Consulta realizada com sucesso!');
      return response.json();
    }else{
      toast('Erro: '+response.status);
    }
  })
  .then(data => {
    document.getElementById('cep').innerHTML = data.cep;
    document.getElementById('local').innerHTML = 'Local: '+data.localidade+', '+data.uf;
    document.getElementById('bairro').innerHTML =  'Bairro: '+data.bairro;
    document.getElementById('logradouro').innerHTML = 'Logradouro: '+data.logradouro;
    document.getElementById('complemento').innerHTML = 'Complemento: '+data.complemento;
  })
  .catch(err => {
    toast(err.message);
  })
}