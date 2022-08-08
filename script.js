const btn_novaPartida = document.getElementById('btn_nova_partida')
const btn_enviar = document.getElementById('btn_enviar')
const input_palpite = document.getElementById('input_palpite')
const info = document.getElementById('info');
const segmentos = document.getElementById('segmentos')

const txt_emenor = 'É menor'
const txt_emaior = 'É maior'
const txt_acertou = 'Você acertou!!!!'
const txt_erro = 'ERRO'
const cor_laranja = '#EF6C00'
const cor_vermelho = '#CC3300'
const cor_verde = '#32BF00'
const cor_preto = '#262A34'
const cor_cinza = '#DDDDDD'


const url = 'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300'
var numeroSorteado = '';


function obterNumeroAleatorio() {
    fetch(url)
        .then(response => response.json()) // Faze o parse da resposta da requisicao
        .then(parsedResponse => {
            if (parsedResponse.value != null) { // verifica se veio um valor e caso sim, salva ele na variavel 'numeroSorteado'
                numeroSorteado = parsedResponse.value
            } else { // caso de erro atualiza o texto e os segmentos para indicar que houve erro na requisicao
                const statusCode = parsedResponse.StatusCode
                erroNaRequisicao(statusCode)
            }
        })
}

function enviarPalpite() {
    var palpite = input_palpite.value // obtem o valor do input
    if (palpite === '') { // caso seja vazio, não atualizar os segmentos
        return;
    }

    // O display pode conter números não-negativos de 1 a 3 algarismos.
    // Caso não siga essa regra, não atualizar os segmentos
    if(palpite < 0 || palpite > 999){
        return;
    }

    input_palpite.value = '' // limpa o valor do input
    info.style.color = cor_laranja //seta a cor do input para laranja

    montarSegmentos(palpite)

    if (palpite > numeroSorteado) { // quando o palpite enviado é maior que o número obtido
        info.innerText = txt_emenor
    } else if (palpite < numeroSorteado) { // quando o palpite enviado é menor que o número obtido
        info.innerText = txt_emaior
    } else { // quando o palpite enviado é igual ao número obtido
        info.innerText = txt_acertou //set o texto para 'acertou'
        info.style.color = cor_verde // seta a cor para verde
        btn_enviar.disabled = true // desabilita o botão enviar
        input_palpite.disabled = true; // desabilita o input do palpite
        btn_novaPartida.style.visibility = "visible" // mostra o botão nova partida
        montarSegmentos(palpite, false, true)
    }

}

function erroNaRequisicao(statusCode) {
    info.innerText = txt_erro   // Set o texto para 'erro'
    info.style.color = cor_vermelho  // Set a cor para vermelho
    btn_enviar.disabled = true // desabilita o botão enviar
    input_palpite.disabled = true; // desabilita o input do palpite
    btn_novaPartida.style.visibility = "visible" // mostra o botão nova partida
    montarSegmentos(statusCode, true) // monta os seguimentos para o erro
}

function novaPartida() {
    montarSegmentoInicial()
    obterNumeroAleatorio()
    info.innerText = '' // limpa o texto
    btn_enviar.disabled = false // habilita o botão enviar
    input_palpite.disabled = false; // habilita o input de palpite
    btn_novaPartida.style.visibility = "hidden" // esconde o botao de nova partida
}

function montarSegmentoInicial() {
    /*
    Este método reseta os segmentos para o valor de 0 quando uma nova partida é criada
    */
    segmentos.innerHTML = ''
    var divGroup = document.createElement('div')
    divGroup.style.margin = '0 5px'
    var divTop = document.createElement('div')
    divTop.classList.add('segmento')
    divTop.id = 'top_0'
    var divBot = document.createElement('div')
    divBot.classList.add('segmento')
    divBot.id = 'bot_0'

    divGroup.appendChild(divTop)
    divGroup.appendChild(divBot)
    segmentos.appendChild(divGroup)
}

function montarSegmentos(numero, erroNaReq = false, acertou = false) {
    // Limpa a div de segmentos
    segmentos.innerHTML = ''
    // Descobrir quantos e quais digitos
    stringNumero = numero.toString()

    digitos = [] // Armazena os digiots em um array
    for (var i = 0; i < stringNumero.length; i++) {
        digitos.push(stringNumero.charAt(i));
    }

    // Escolhe a cor dos segmentos
    var corSegmento = cor_preto

    if (erroNaReq) {
        corSegmento = cor_vermelho
    }

    if (acertou) {
        corSegmento = cor_verde
    }

    // Cria os segmentos para cada digito
    digitos.forEach(digito => {
        // Cria a div de agrupamento
        var divGroup = document.createElement('div')
        divGroup.style.margin = '0 5px'
        var divTop = document.createElement('div') // cria a parte de cima do digito
        divTop.classList.add('segmento')
        var divBot = document.createElement('div') // cria a parte de baixo do digito
        divBot.classList.add('segmento')

        // Estiliza de acordo com cara número
        switch (digito) {
            case '0':
                divTop.style.border = `10px solid ${corSegmento}`
                divTop.style.borderBottom = `10px solid ${cor_cinza}`
                divBot.style.border = `10px solid ${corSegmento}`
                divBot.style.borderTop = `10px solid ${cor_cinza}`
                break;
            case '1':
                divTop.style.border = `10px solid ${cor_cinza}`
                divTop.style.borderRight = `10px solid ${corSegmento}`
                divBot.style.border = `10px solid ${cor_cinza}`
                divBot.style.borderRight = `10px solid ${corSegmento}`
                break;
            case '2':
                divTop.style.border = `10px solid ${corSegmento}`
                divTop.style.borderLeft = `10px solid ${cor_cinza}`
                divBot.style.border = `10px solid ${corSegmento}`
                divBot.style.borderRight = `10px solid ${cor_cinza}`
                break;
            case '3':
                divTop.style.border = `10px solid ${corSegmento}`
                divTop.style.borderLeft = `10px solid ${cor_cinza}`
                divBot.style.border = `10px solid ${corSegmento}`
                divBot.style.borderLeft = `10px solid ${cor_cinza}`
                break;
            case '4':
                divTop.style.border = `10px solid ${corSegmento}`
                divTop.style.borderTop = `10px solid ${cor_cinza}`
                divBot.style.border = `10px solid ${corSegmento}`
                divBot.style.borderLeft = `10px solid ${cor_cinza}`
                divBot.style.borderBottom = `10px solid ${cor_cinza}`
                break;
            case '5':
                divTop.style.border = `10px solid ${corSegmento}`
                divTop.style.borderRight = `10px solid ${cor_cinza}`
                divBot.style.border = `10px solid ${corSegmento}`
                divBot.style.borderLeft = `10px solid ${cor_cinza}`
                break;
            case '6':
                divTop.style.border = `10px solid ${corSegmento}`
                divTop.style.borderRight = `10px solid ${cor_cinza}`
                divBot.style.border = `10px solid ${corSegmento}`
                break;
            case '7':
                divTop.style.border = `10px solid ${corSegmento}`
                divTop.style.borderLeft = `10px solid ${cor_cinza}`
                divTop.style.borderBottom = `10px solid ${cor_cinza}`
                divBot.style.border = `10px solid ${cor_cinza}`
                divBot.style.borderRight = `10px solid ${corSegmento}`
                break;
            case '8':
                divTop.style.border = `10px solid ${corSegmento}`
                divBot.style.border = `10px solid ${corSegmento}`
                break;
            case '9':
                divTop.style.border = `10px solid ${corSegmento}`
                divBot.style.border = `10px solid ${corSegmento}`
                divBot.style.borderLeft = `10px solid ${cor_cinza}`
                break;
        }

        // Agrupa os segmentos em uma div e adiciona na div de segmentos
        divGroup.appendChild(divTop)
        divGroup.appendChild(divBot)
        segmentos.appendChild(divGroup)
    });
}

obterNumeroAleatorio()