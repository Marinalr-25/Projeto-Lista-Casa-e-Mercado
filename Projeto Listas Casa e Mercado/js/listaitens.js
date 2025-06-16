//VERIFICAR PQ A PAGINA CARREGA DIRETO NO PRANCHETA EM VEZ DO ATIVO (MERCADO)
//CRIAR FUNCOES PARA EVITAR DUPLICIDADE (EDITAR, EXCLUIR, BOTAOSIM, BOTAOeDITAR)
export default function listaItens() {
  document.addEventListener('DOMContentLoaded', () => {
    const adicionarItem = document.querySelectorAll('.adicionarItem');
    const popup = document.querySelector('.popupAdicionar');
    const popupEditar = document.querySelector('.popupEditar');
    const popupExcluir = document.querySelector('.popUpExcluir');
    const botaoNao = document.querySelector('.popUpExcluir__botao--nao');
    const botaoSim = document.querySelector('.popUpExcluir__botao--sim');
    const fecharItem = document.querySelector('.popupAdicionar__fechar');
    const fecharPopupEditar = document.querySelector('.popupEditar__fechar');
    const botaoAdicionar = document.querySelector(
      '.popupAdicionar__botaoAdicionar'
    );
    const botaoEditar = document.querySelector('.popupEditar__botaoEditar');
    const inputNome = document.querySelector('.popupAdicionar__nomeItemForm');
    const inputQtd = document.querySelector('.popupAdicionar__qtdItemForm');
    const inputNomeedit = document.querySelector(
      '.popupEditar__nomeItemFormedit'
    );
    const inputQtdedit = document.querySelector(
      '.popupEditar__qtdItemFormedit'
    );
    const secaoListaItem = document.querySelector('.listaItem');
    const secaoMercado = document.querySelector('.listaMercado');
    const botaoSuperMercado = document.querySelector('.footerSupermercado');
    const botaoListaItens = document.querySelector('.footerListaItens');
    const imgPrancheta = botaoListaItens.querySelector('.imgPrancheta');
    const imgCarrinho = botaoSuperMercado.querySelector('.imgCarrinho');
    let ativo;
    let origemAtual;
    let itensCasa = JSON.parse(localStorage.getItem('itensCasa')) || [];
    let itensMercado = JSON.parse(localStorage.getItem('itensMercado')) || [];
    let itemEditado = null;

    //editar o texto para primeira letra maiuscula
    function capitalizarPrimeiraLetra(texto) {
      return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }

    //verificar qual aba esta ativa e defenir lista a adicionar
    function verificarAtivo() {
      if (secaoListaItem.classList.contains('ativo')) {
        ativo = 'casa';
        console.log(secaoListaItem);
        return document.querySelector('.casa__itens');
      } else if (secaoMercado.classList.contains('ativo')) {
        ativo = 'mercado';
        console.log(secaoMercado);
        return document.querySelector('.mercado__itens');
      }
    }

    //para ao carregar a pagina, ter os itens salvos
    function carregamentoLocalStorage(itensCM, itens) {
      itensCM.forEach((item) => {
        criarNovoItem(
          item.nome,
          item.quantidade,
          document.querySelector(`.${itens}`)
        );
      });
    }
    carregamentoLocalStorage(itensCasa, 'casa__itens');
    carregamentoLocalStorage(itensMercado, 'mercado__itens');

    //animacao dos botoes mercado e casa
    function toggleBotoesNav(botaoClicado, botaoAlterado) {
      botaoClicado.addEventListener('click', () => {
        botaoClicado.style.animation = 'subir 0.5s forwards ';
        botaoAlterado.style.animation = 'descer 0.5s forwards ';
        if (botaoClicado === botaoSuperMercado) {
          secaoListaItem.style.display = 'none';
          secaoMercado.style.display = 'block';
          secaoListaItem.classList.remove('ativo');
          secaoMercado.classList.add('ativo');
          imgCarrinho.style.width = '40px';
          imgPrancheta.style.width = '40px';
          verificarAtivo();
          imgPrancheta.setAttribute('src', 'img/listaItensNaoSelecionado.png');
        } else if (botaoClicado === botaoListaItens) {
          secaoListaItem.style.display = 'block';
          secaoMercado.style.display = 'none';
          secaoListaItem.classList.add('ativo');
          secaoMercado.classList.remove('ativo');
          verificarAtivo();
          imgPrancheta.setAttribute('src', 'img/listaItensSelecionado.png');
        }
        setTimeout(() => {
          botaoAlterado.classList.remove('selecionado');
          botaoClicado.classList.add('selecionado');
          botaoClicado.style.animation = '';
          botaoAlterado.style.animation = '';
        }, 500);
      });
    }
    toggleBotoesNav(botaoSuperMercado, botaoListaItens);
    toggleBotoesNav(botaoListaItens, botaoSuperMercado);

    // function adicionarNaListaCorreta("itensCasa",itensCasa) {
    function adicionarNaListaCorreta() {
      verificarAtivo();
      const chave = ativo === 'casa' ? 'itensCasa' : 'itensMercado';
      console.log('chave apos adicionar na lista', chave);
      if (inputNome.value !== '' && inputQtd.value !== '') {
        const lista = verificarAtivo();
        console.log(lista);
        const nomeItem = capitalizarPrimeiraLetra(inputNome.value.trim());
        const qtdItem = inputQtd.value;
        const idUnico = Date.now().toString();
        //pegar a lista antiga
        const dadosSalvos = localStorage.getItem(`${chave}`);
        const listaDados = dadosSalvos ? JSON.parse(dadosSalvos) : [];

        const indexExistente = listaDados.findIndex(
          (item) =>
            item.nome.trim().toLowerCase() === nomeItem.trim().toLowerCase()
        );

        //se o item nao existir ele cria normalmente
        if (indexExistente === -1) {
          criarNovoItem(nomeItem, qtdItem, lista);

          //adicionar novo item
          const detalhesItem = {
            id: idUnico,
            nome: nomeItem,
            quantidade: qtdItem,
          };

          listaDados.push(detalhesItem);
          localStorage.setItem(`${chave}`, JSON.stringify(listaDados));

          //resetar formulario
          popup.style.display = 'none';
          inputNome.value = '';
          inputQtd.value = '';
        } else if (indexExistente !== -1) {
          alert('Este item ja existe na lista');
        }
      } else {
        alert(
          'Por favor, insira o nome e a quantidade do item para adicionar na lista'
        );
      }
    }

    //abrir popup adicionar
    function abrirPopupAdicionar(botao) {
      popup.style.display = 'flex';
      inputNome.value = '';
      inputQtd.value = '';
    }

    // Funcao de criar novo item na tela
    function criarNovoItem(nomeItem, qtdItem, lista) {
      const novoItem = document.createElement('div');
      novoItem.classList.add('item');
      novoItem.innerHTML = `
      <div class="nomeItem">${nomeItem} </div>
      <div class="qtdEIcones">
        <div class="qtdItem">${qtdItem}</div>
        <div class="icones__editDelete">
          <img class="editarItem" src="img/editar.png" alt="Editar" />
          <img class="excluirItem" src="img/excluir.png" alt="Excluir" />
        </div>
        </div>
      `;
      lista.appendChild(novoItem);
    }

    //funcao para fechar popups
    function fecharPopUps(botao, popup) {
      botao.addEventListener('click', () => {
        popup.style.display = 'none';
      });
    }
    fecharPopUps(fecharItem, popup);
    fecharPopUps(fecharPopupEditar, popupEditar);
    fecharPopUps(botaoNao, popupExcluir);
    fecharPopUps(botaoSim, popupExcluir);

    //colocar evento no container lista para poder editar e excluir
    document.addEventListener('click', (e) => {
      const editarItem = e.target.closest('.editarItem');
      const excluirItem = e.target.closest('.excluirItem');
      if (editarItem) {
        verificarAtivo();
        const chave = ativo === 'casa' ? 'itensCasa' : 'itensMercado';
        console.log(chave);
        //pegar o container daquele item
        const esteItem = e.target.closest('.item');
        //pegar referencia do nome e qtd
        const nomeItem = esteItem.querySelector('.nomeItem');
        const qtdItem = esteItem.querySelector('.qtdItem');
        //Salva o item editado
        itemEditado = esteItem;
        // Preenche os campos do popup com os valores atuais
        inputNomeedit.value = nomeItem.textContent;
        inputNomeedit.readOnly = true;
        inputQtdedit.value = qtdItem.textContent;
        //abre o popup
        popupEditar.style.display = 'flex';
      }

      if (excluirItem) {
        //pegar o container daquele item
        const esteItem = e.target.closest('.item');
        popupExcluir.style.display = 'flex';
        itemEditado = esteItem;
        //pegar referencia do nome e qtd
        const nomeItem = esteItem.querySelector('.nomeItem');
        const qtdItem = esteItem.querySelector('.qtdItem');
        const nomeItemExcluir = popupExcluir.querySelector(
          '.popUpExcluir__itens--nome'
        );
        const qtdItemExcluir = popupExcluir.querySelector(
          '.popUpExcluir__itens--qtd'
        );
        //exibindo os valores clicado
        nomeItemExcluir.textContent = nomeItem.textContent;
        qtdItemExcluir.textContent = qtdItem.textContent;
      }
    });

    //botao editar
    botaoEditar.addEventListener('click', () => {
      verificarAtivo();
      console.log('ativo apos editar item', ativo);
      const chave = ativo === 'casa' ? 'itensCasa' : 'itensMercado';
      console.log('chave apos editar item', chave);

      if (itemEditado) {
        const nomeItemEditado = itemEditado
          .querySelector('.nomeItem')
          .textContent.trim();
        const qtdItemEditado = itemEditado.querySelector('.qtdItem');
        qtdItemEditado.textContent = inputQtdedit.value;
        popupEditar.style.display = 'none';
        itemEditado = null;

        //salvando no localStorage
        const listaDadosEditado =
          JSON.parse(localStorage.getItem(`${chave}`)) || [];
        const index = listaDadosEditado.findIndex(
          (item) => item.nome === nomeItemEditado
        );
        if (index !== -1) {
          listaDadosEditado[index].quantidade = inputQtdedit.value;
          localStorage.setItem(`${chave}`, JSON.stringify(listaDadosEditado));
        }
      }
    });

    //botao excluir(sim)
    botaoSim.addEventListener('click', () => {
      verificarAtivo();
      const chave = ativo === 'casa' ? 'itensCasa' : 'itensMercado';
      console.log('chave apos excluir item', chave);
      console.log('ativo apos excluir item', ativo);
      if (itemEditado) {
        const nomeItem = itemEditado.querySelector('.nomeItem').textContent;
        const nomeFormatado = nomeItem.trim().toLowerCase();

        //apagar do html
        itemEditado.remove();
        itemEditado = null;

        //remover do localStorage
        const listaDadosExcluido =
          JSON.parse(localStorage.getItem(`${chave}`)) || [];

        //findIndex Se encontrar um item com o mesmo nome, retorna o índice (ex: 0, 1, etc.)
        //Se não encontrar, retorna -1
        const index = listaDadosExcluido.findIndex(
          (item) => item.nome.trim().toLowerCase() === nomeFormatado
        );

        //"Se encontrou o item no array, ou seja, se o índice não for -1, execute o código abaixo."
        if (index !== -1) {
          listaDadosExcluido.splice(index, 1); // remove 1 item na posição encontrada
          localStorage.setItem(`${chave}`, JSON.stringify(listaDadosExcluido));
        }
      }
    });

    adicionarItem.forEach((botaoMais) => {
      botaoMais.addEventListener('click', () => {
        origemAtual = botaoMais.dataset.origem;
        console.log('origemAtual apos clicar em adicionar', origemAtual);
        abrirPopupAdicionar(botaoMais);
      });
    });

    //adicionar na tela o item adicionado
    botaoAdicionar.addEventListener('click', () => {
      verificarAtivo();
      if (ativo === 'casa') {
        adicionarNaListaCorreta();
      } else if (ativo === 'mercado') {
        adicionarNaListaCorreta();
      }
    });
  });
}
