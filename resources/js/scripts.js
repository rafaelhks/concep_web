var input_cep = document.getElementById('input_cep');
var cep_card = document.getElementById('cep-card');
var message = document.getElementById('message');

input_cep.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    busca();
  }
}); 

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

function clearCEP(){
  cep_card.style.visibility = 'hidden';
  message.style.display = 'block';
}

function validate(cep){
  return cep.match('^\\d{5}[-]\\d{3}$') || cep.match('^\\d{5}\\d{3}$');
}

function busca(){
  var cep = input_cep.value;

  if(!validate(cep)){
    toast('CEP inválido!');
    return null;
  }

  var url = 'https://viacep.com.br/ws/'+cep+'/json/';
  console.log('fetching: '+url);

  fetch(url)
  .then(response => {
    if(response.status === 200){
      return response.json();
    }else{
      toast('Erro: '+response.status);
    }
  })
  .then(data => {
    if(data.erro == true){
      toast('CEP não encontrado!');
      return;
    }else{
      toast('Consulta realizada com sucesso!');
    }
    cep_card.style.visibility = 'visible';
    message.style.display = 'none';
    document.getElementById('cep').innerHTML = data.cep;
    document.getElementById('local').innerHTML = 'Local: '+formatData(data.localidade)+', '+formatData(data.uf);
    document.getElementById('bairro').innerHTML =  'Bairro: '+formatData(data.bairro);
    document.getElementById('logradouro').innerHTML = 'Logradouro: '+formatData(data.logradouro);
    document.getElementById('complemento').innerHTML = 'Complemento: '+formatData(data.complemento);
    document.getElementById('cod-ibge').innerHTML = 'Código IBGE: '+formatData(data.ibge);
    document.getElementById('cod-gia').innerHTML = 'Código GIA: '+formatData(data.dia);
  })
  .catch(err => {
    toast(err.message);
  })
}

function formatData(data) {
  return data ? data : 'Informação ausente.';
}