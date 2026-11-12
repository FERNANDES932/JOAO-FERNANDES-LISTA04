const inputCep = document.querySelector('#cep');
const botao = document.querySelector('#buscar');
const resultado = document.querySelector('#resultado');

function mostrarErro() {
  resultado.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'erro';
  p.textContent = 'Erro ao buscar endereço.';
  resultado.appendChild(p);
}

function mostrarEndereco(dados) {
  resultado.innerHTML = '';
  const campos = [
    ['Logradouro', dados.logradouro],
    ['Bairro', dados.bairro],
    ['Cidade', dados.localidade],
    ['Estado', dados.uf]
  ];
  campos.forEach(([rotulo, valor]) => {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = rotulo + ': ';
    p.appendChild(strong);
    p.appendChild(document.createTextNode(valor || ''));
    resultado.appendChild(p);
  });
}

async function buscarEndereco() {
  // remove tudo que não for número (aceita 79104-830)
  const cep = inputCep.value.replace(/\D/g, '');

  if (cep.length !== 8) {
    mostrarErro();
    return;
  }

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!resposta.ok) throw new Error('Resposta inválida');

    const dados = await resposta.json();
    if (dados.erro) throw new Error('CEP não encontrado');

    mostrarEndereco(dados);
  } catch (e) {
    mostrarErro();
  }
}

botao.addEventListener('click', buscarEndereco);
inputCep.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscarEndereco();
});