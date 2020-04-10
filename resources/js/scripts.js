const input_cep = document.getElementById('input_cep');
const cep_card = document.getElementById('cep-card');
const message = document.getElementById('message');
const cep_field = document.getElementById('cep');
const local = document.getElementById('local');
const bairro = document.getElementById('bairro');
const logradouro = document.getElementById('logradouro');
const complemento = document.getElementById('complemento');
const cod_ibge = document.getElementById('cod-ibge');
const cod_gia = document.getElementById('cod-gia');
const loader = document.getElementById('loader');
const metaType = [{type:'text/plain', ext:'txt'}, {type:'application/json', ext:'json'}];

var current_cep = {};

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
  message.style.visibility = 'visible';
}

function validate(cep){
  return cep.match('^\\d{5}[-]\\d{3}$') || cep.match('^\\d{5}\\d{3}$');
}

function busca(){
  var cep = input_cep.value;

  if(!validate(cep)){
    toast('CEP inválido!');
    return;
  }

  message.style.visibility = 'hidden';
  loader.style.display = 'inline-block';

  var url = 'https://viacep.com.br/ws/'+cep+'/json/';
	
  const controller = new AbortController();
  const config = {signal: controller.signal }

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  fetch(url, config)
  .then(response => {
    if(response.status === 200){
      return response.json();
    }else{
      toast('Erro: '+response.status);
      message.style.visibility = 'visible';
    }
  })
  .then(data => {
    loader.style.display = 'none';
    if(data.erro == true){
      toast('CEP não encontrado!');
      message.style.visibility = 'visible';
      return;
    }else{
      toast('Consulta realizada com sucesso!');
    }
    cep_card.style.visibility = 'visible';
    message.style.display = 'none';
    current_cep = data;
    
    fillCepCard();
  })
  .catch(err => {
    if (err.name === 'AbortError') {
      toast('Tempo de conexão com a API ViaCEP expirado.');
    }else{
      toast(err.message);    
    }
    loader.style.display = 'none';
    message.style.visibility = 'visible';
  })
}

function fillCepCard(){
  cep_field.innerHTML = current_cep.cep;
  local.innerHTML = formatData(current_cep.localidade)+', '+formatData(current_cep.uf);
  bairro.innerHTML =  formatData(current_cep.bairro);
  logradouro.innerHTML = formatData(current_cep.logradouro);
  complemento.innerHTML = formatData(current_cep.complemento);
  cod_ibge.innerHTML = formatData(current_cep.ibge);
  cod_gia.innerHTML = formatData(current_cep.gia);
}

function formatData(data) {
  return data ? data : 'Informação ausente.';
}

function downloadFile(type) {
  var dtype = metaType[type];
  var text = '';
  if(type===0) {
    text = 'CEP: '+current_cep.cep+'\r\n'
          +'Local: '+formatData(current_cep.localidade)+', '+formatData(current_cep.uf)+'\r\n'
          +'Bairro: '+formatData(current_cep.bairro)+'\r\n'
          +'Logradouro: '+formatData(current_cep.logradouro)+'\r\n'
          +'Complemento: '+formatData(current_cep.complemento)+'\r\n'
          +'Código IBGE: '+formatData(current_cep.ibge)+'\r\n'
          +'Código GIA: '+formatData(current_cep.gia);
  } else if (type===1) {
    text = JSON.stringify(current_cep);	  
  }  
  var element = document.createElement('a');
  element.setAttribute('href', 'data:'+dtype.type+';charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', cep_field.innerHTML+'.'+dtype.ext);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
