export function arquivoTutorial() {
  document.addEventListener('DOMContentLoaded', () => {
    const blackPopUp480 = document.querySelector('.blackPopUp480');
    const popUpTutorial = document.querySelector('.popUpTutorial');
    const box1 = document.querySelector('.box1');
    const btnProximo1 = document.querySelector('.proximo1');
    const btnProximo2 = document.querySelector('.proximo2');

    function tutorial() {
      popUpTutorial.style.display = 'block';
      btnProximo1.addEventListener('click', () => {
        box1.style.animation = 'leftToRight 0.5s forwards ';
        btnProximo1.style.animation = 'poximoRightToLeft 0.5s forwards ';
        setTimeout(() => {
          popUpTutorial.style.webkitMaskImage =
            'radial-gradient(circle var(--mask-circle) at right var(--mask-left) bottom var(--mask-bottom), transparent 99%, black 100%)';
          box1.innerHTML =
            'Aqui vc adiciona itens a sua plancheta check de itens que <b> ja possui em casa</b>';
          btnProximo1.style.display = 'none';
        }, 300);
      });
      btnProximo2.addEventListener('click', () => {
        popUpTutorial.style.display = 'none';
        popUpTutorial.style.background = 'none';
        localStorage.setItem('tutorial', 'true');
      });
    }

    //separacao
    const naoMostrar = localStorage.getItem('naoMostrarPopup480');
    const tutorialLS = localStorage.getItem('tutorial');

    function mostrarPopup() {
      console.log(naoMostrar);
      if (naoMostrar !== 'true' && window.innerWidth > 480) {
        blackPopUp480.style.display = 'flex';
      } else {
        mostrarTutorial();
      }
    }
    function mostrarTutorial() {
      console.log(tutorialLS);
      if (tutorialLS !== 'true') {
        tutorial();
      }
    }

    function fecharPopup() {
      blackPopUp480.style.display = 'none';
      mostrarTutorial();
    }

    function naoMostrarNovamente() {
      localStorage.setItem('naoMostrarPopup480', 'true');
    }

    const fecharPopup480 = document.querySelector('.popUp480__fechar');
    const naoMostrar480 = document.querySelector('.popUp480__naoMostrar');

    naoMostrar480.addEventListener('click', naoMostrarNovamente);
    fecharPopup480.addEventListener('click', fecharPopup);
    mostrarPopup();
  });
}
