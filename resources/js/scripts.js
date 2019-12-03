var input_cep = document.getElementById('input_cep');
var cep_card = document.getElementById('cep-card');
var message = document.getElementById('message');
var cep_field = document.getElementById('cep');
var local = document.getElementById('local');
var bairro = document.getElementById('bairro');
var logradouro = document.getElementById('logradouro');
var complemento = document.getElementById('complemento');
var cod_ibge = document.getElementById('cod-ibge');
var cod_gia = document.getElementById('cod-gia');
var loader = document.getElementById('loader');

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

  loader.style.display = 'inline-block';

  var url = 'https://viacep.com.br/ws/'+cep+'/json/';
  console.log('fetching: '+url);
	
  const controller = new AbortController();
  const config = { ...options, signal: controller.signal }

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  fetch(url)
  .then(response => {
    if(response.status === 200){
      return response.json();
    }else{
      toast('Erro: '+response.status);
    }
  })
  .then(data => {
    loader.style.display = 'none';
    if(data.erro == true){
      toast('CEP não encontrado!');
      return;
    }else{
      toast('Consulta realizada com sucesso!');
    }
    cep_card.style.visibility = 'visible';
    message.style.display = 'none';
    cep_field.innerHTML = data.cep;
    local.innerHTML = 'Local: '+formatData(data.localidade)+', '+formatData(data.uf);
    bairro.innerHTML =  'Bairro: '+formatData(data.bairro);
    logradouro.innerHTML = 'Logradouro: '+formatData(data.logradouro);
    complemento.innerHTML = 'Complemento: '+formatData(data.complemento);
    cod_ibge.innerHTML = 'Código IBGE: '+formatData(data.ibge);
    cod_gia.innerHTML = 'Código GIA: '+formatData(data.dia);
  })
  .catch(err => {
    if (err.name === 'AbortError') {
      toast('Tempo de conexão com a API ViaCEP expirado.');
    }else{
      toast(err.message);    
    }
  })
}

function formatData(data) {
  return data ? data : 'Informação ausente.';
}

function download() {
  
  text = 'CEP: '+cep_field.innerHTML+'\r\n'
          +local.innerHTML+'\r\n'
          +bairro.innerHTML+'\r\n'
          +logradouro.innerHTML+'\r\n'
          +complemento.innerHTML+'\r\n'
          +cod_ibge.innerHTML+'\r\n'
          +cod_gia.innerHTML;

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', cep_field.innerHTML+'.txt');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const fetchWithTimeout = (uri, options = {}, time = 5000) => {
  const controller = new AbortController()
  const config = { ...options, signal: controller.signal }

  const timeout = setTimeout(() => {
    controller.abort();
  }, time)

  return fetch(uri, config)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }
      return response
    })
    .catch(error => {
      if (error.name === 'AbortError') {
        throw new Error('Response timed out')
      }
      throw new Error(error.message)
    })
}
