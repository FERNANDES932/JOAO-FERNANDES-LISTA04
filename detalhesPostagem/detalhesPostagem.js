const selectUsuario = document.querySelector('#usuario');
const divPosts = document.querySelector('#posts');
const API = 'https://jsonplaceholder.typicode.com';

async function carregarUsuarios() {
  try {
    const resposta = await fetch(`${API}/users`);
    const usuarios = await resposta.json();

    usuarios.forEach((u) => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = u.name;
      selectUsuario.appendChild(opt);
    });
  } catch (e) {
    divPosts.textContent = 'Erro ao carregar os usuários.';
  }
}

async function carregarPosts(userId) {
  divPosts.innerHTML = '';
  try {
    const resposta = await fetch(`${API}/posts?userId=${userId}`);
    const posts = await resposta.json();

    posts.forEach((post) => {
      const titulo = document.createElement('div');
      titulo.className = 'titulo-post';
      titulo.textContent = post.title;
      titulo.addEventListener('click', () => detalharPost(post.id, titulo));
      divPosts.appendChild(titulo);
    });
  } catch (e) {
    divPosts.textContent = 'Erro ao carregar as postagens.';
  }
}

async function detalharPost(postId, tituloEl) {
  // remove detalhes e seleção anteriores
  const anterior = divPosts.querySelector('.detalhes');
  if (anterior) anterior.remove();
  divPosts.querySelectorAll('.titulo-post').forEach((el) => el.classList.remove('selecionado'));
  tituloEl.classList.add('selecionado');

  const detalhes = document.createElement('div');
  detalhes.className = 'detalhes';
  detalhes.textContent = 'Carregando...';
  tituloEl.after(detalhes); // exibe embaixo do título clicado

  try {
    const [respPost, respComentarios] = await Promise.all([
      fetch(`${API}/posts/${postId}`),
      fetch(`${API}/posts/${postId}/comments`)
    ]);
    const post = await respPost.json();
    const comentarios = await respComentarios.json();

    detalhes.innerHTML = '';

    const h3 = document.createElement('h3');
    h3.textContent = post.title;
    detalhes.appendChild(h3);

    const corpo = document.createElement('p');
    corpo.textContent = post.body;
    detalhes.appendChild(corpo);

    const h4 = document.createElement('h4');
    h4.textContent = 'Comentários:';
    detalhes.appendChild(h4);

    const lista = document.createElement('div');
    lista.className = 'comentarios';
    comentarios.forEach((c) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = c.name;
      p.appendChild(strong);
      p.appendChild(document.createTextNode(': ' + c.body));
      lista.appendChild(p);
    });
    detalhes.appendChild(lista);
  } catch (e) {
    detalhes.textContent = 'Erro ao carregar os detalhes da postagem.';
  }
}

selectUsuario.addEventListener('change', () => {
  if (selectUsuario.value) {
    carregarPosts(selectUsuario.value);
  } else {
    divPosts.innerHTML = '';
  }
});

carregarUsuarios();