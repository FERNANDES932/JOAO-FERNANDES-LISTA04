const selectEstado = document.querySelector('#estado');
const selectCidade = document.querySelector('#cidade');
const resultado = document.querySelector('#resultado');

function resetarCidades(texto, desabilitar) {
  selectCidade.innerHTML = '';
  const opt = document.createElement('option');
  opt.value = '';
  opt.textContent = texto;
  selectCidade.appendChild(opt);
  selectCidade.disabled = desabilitar;
}

function atualizarResultado() {
  const estadoOpt = selectEstado.options[selectEstado.selectedIndex];
  const cidadeOpt = selectCidade.options[selectCidade.selectedIndex];

  if (selectEstado.value && selectCidade.value) {
    resultado.textContent = `Você selecionou: ${cidadeOpt.textContent} - ${estadoOpt.textContent}`;
  } else {
    resultado.textContent = '';
  }
}

async function carregarEstados() {
  try {
    const resposta = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    const estados = await resposta.json();

    estados.forEach((estado) => {
      const opt = document.createElement('option');
      opt.value = estado.sigla;      // UF usada na segunda requisição
      opt.textContent = estado.nome;
      selectEstado.appendChild(opt);
    });
  } catch (e) {
    resultado.textContent = 'Erro ao carregar os estados.';
  }
}

async function carregarCidades(uf) {
  resetarCidades('Carregando...', true);
  try {
    const resposta = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
    const cidades = await resposta.json();

    resetarCidades('Selecione uma cidade', false);
    cidades.forEach((cidade) => {
      const opt = document.createElement('option');
      opt.value = cidade.id;
      opt.textContent = cidade.nome;
      selectCidade.appendChild(opt);
    });
  } catch (e) {
    resetarCidades('Selecione uma cidade', true);
    resultado.textContent = 'Erro ao carregar as cidades.';
  }
}

selectEstado.addEventListener('change', () => {
  resultado.textContent = '';
  if (selectEstado.value) {
    carregarCidades(selectEstado.value);
  } else {
    resetarCidades('Selecione uma cidade', true);
  }
});

selectCidade.addEventListener('change', atualizarResultado);

carregarEstados();