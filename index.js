import PromptSync from "prompt-sync";
import nReadlines from "n-readlines";
import { readFile, writeFile } from 'fs/promises';
import { appendFileSync, existsSync, writeFileSync } from "fs";

import { Piloto, servicoPiloto } from "./Classes/Piloto.js";
import { Aerovias, servicoAerovias } from "./Classes/Aerovias.js";
import { Aeronave, AeronaveCarga, AeronaveParticular, AeronavePassageiros, servicoAeronaves } from "./Classes/Aeronave.js";
import { Plano, servicoPlanos } from "./Classes/Planos.js";

const prompt = PromptSync({ sigint: true });

/**
 * Inicia o sistema, carregando dados de arquivos, criando entidades e oferecendo opções ao usuário.
 * @returns {void}
 */
function start() {
    // carrega os dados dos arquivos de cada entidade
    const dadosPiloto = carregaDados('./data/piloto.csv', 'piloto');
    const dadosAerovias = carregaDados('./data/aerovias.csv', 'aerovia');
    const dadosAeronave = carregaDados('./data/aeronave.csv', 'aeronave');
    const dadosPlanos = carregaDados('./data/planosVoo.csv', 'planos');

    // cria os dados de cada entidade
    criaPilotos(dadosPiloto);
    criaAerovias(dadosAerovias);
    criaAeronaves(dadosAeronave);
    criaPlanos(dadosPlanos);

    // opções disponibilizadas para o usuário
    let opcoes = [
        "1 - Listar as aerovias existentes entre dois aeroportos?",
        "2 - Listar as altitudes livres em uma determinada aerovia em um determinado horário?",
        "3 - Submeter um plano de voo para aprovação? (retorna o número do plano aprovado)",
        "4 - Listar um plano a partir do número?",
        "5 - Listar todos os planos previstos para uma determinada data? (passada, presente ou futura)",
        "6 - Listar a ocupação de uma aerovia em uma determinada data? (passada, presente ou futura)",
        "7 - Cancelar um plano de voo?",
        "8 - Reativar um plano de voo?",
    ]

    prompt(`===== Pressione ENTER para iniciar o sistema =====`);

    // recebe a solicitação do usuário para executar uma função do sistema
    const solicitacaoDopiloto = Number(prompt(`====== O que você deseja? =======\n\n${opcoes[0]}\n${opcoes[1]}\n${opcoes[2]}\n${opcoes[3]}\n${opcoes[4]}\n${opcoes[5]}\n${opcoes[6]}\n${opcoes[7]}\n\nEscolha uma opção (1 - 8): `))

    // lida com o número da solicitação submetida pelo usuário
    realizarFuncionalidadeEscolhidaPeloPiloto(solicitacaoDopiloto);

    // encerra o sistema
    end();
};

start();

/**
 * // função usada para carregar os dados de um arquivo especificado
 * @param {String} arquivo caminho do arquivo a ser carregado
 * @param {String} tipo tipo do arquivo
 * @returns {object} retorna o objeto com os dados do arquivo
 */
function carregaDados(arquivo, tipo) {
    const arq = new nReadlines(arquivo);

    let buffer, linhas, dado, dados = [];

    arq.next();

    while (buffer = arq.next()) {
        linhas = buffer.toString('utf-8');
        dado = linhas.split(',');

        switch (tipo) {
            case 'piloto':
                dados.push({
                    "NumeroDeMatricula": dado[0].trim(),
                    "Nome": dado[1].trim(),
                    "EstadoDeHabilitacao": dado[2].trim()
                })
                break;

            case 'aerovia':
                dados.push({
                    "Identificador": dado[0].trim(),
                    "AeroportoDeOrigem": dado[1].trim(),
                    "AeroportoDeDestino": dado[2].trim(),
                    "TamanhoDaAerovia": dado[3].trim(),
                    "Altitude": dado[4].trim(),
                    "SlotsDeTempo": dado[5].trim(),
                    "EstadoAprovacao": dado[6].trim(),
                    "horario": dado[7].trim()
                })
                break;
            case 'aeronave':
                dados.push({
                    "Prefixo": dado[0].trim(),
                    "TipoDeAeronave": dado[1].trim(),
                    "VelocidadeDeCruzeiro": dado[2].trim(),
                    "Autonomia": dado[3].trim(),
                    "EmpresaDeManutencao": dado[4].trim(),
                    "CapacidadeDePassageiros": dado[5].trim(),
                    "PesoMaximoDeCarga": dado[6].trim(),
                    "CompanhiaAerea": dado[7].trim()
                })
                break;
            case 'planos':
                dados.push({
                    "IdentificadorPlano": dado[0].trim(),
                    "Identificador": dado[1].trim(),
                    "AeroportoOrigem": dado[2].trim(),
                    "AeroportoDestino": dado[3].trim(),
                    "TamanhoAerovia": dado[4].trim(),
                    "Altitude": dado[5].trim(),
                    "SlotsTempo": dado[6].trim(),
                    "EstadoAprovacao": dado[7].trim(),
                    "Horario": dado[8].trim(),
                    "NumeroDeMatriculaDoPiloto": dado[9].trim(),
                    "prefixoAeronave": dado[10].trim(),
                    "VelocidadeCruzeiro": dado[11].trim(),
                    "DataPrevisao": dado[12].trim()
                });
                break;
        }
    }

    return dados;
}


/**
 * // cria as entidades piloto para cada linha de dado recebida
 * @param {Array<Piloto>} dadosPiloto array de dados dos pilotos
 */
function criaPilotos(dadosPiloto) {
    for (let index = 0; index < dadosPiloto.length; index++) {
        const piloto = new Piloto(
            dadosPiloto[index].Nome,
            Number(dadosPiloto[index].EstadoDeHabilitacao),
            dadosPiloto[index].NumeroDeMatricula
        );

        servicoPiloto.adicionaPiloto(piloto);
    }
}

/**
 * // cria as entidades de aerovias para cada linha de dado recebida
 * @param {Array<Aerovias>} dadosAerovias array de dados das aerovias
 */
function criaAerovias(dadosAerovias) {
    for (let index = 0; index < dadosAerovias.length; index++) {
        const aerovia = new Aerovias(
            dadosAerovias[index].Identificador,
            dadosAerovias[index].AeroportoDeOrigem,
            dadosAerovias[index].AeroportoDeDestino,
            dadosAerovias[index].TamanhoDaAerovia,
            dadosAerovias[index].Altitude,
            dadosAerovias[index].SlotsDeTempo,
            dadosAerovias[index].EstadoAprovacao,
            dadosAerovias[index].horario
        );

        servicoAerovias.adicionaAerovias(aerovia);
    }
}

/**
 * // cria as entidades de Aeronave para cada linha de dado recebida
 * @param {Array<Aeronave>} dadosAeronave array de dados das Aeronaves
 */
function criaAeronaves(dadosAeronave) {
    for (let index = 0; index < dadosAeronave.length; index++) {
        let aeronave;
        let TipoDeAeronave = dadosAeronave[index].TipoDeAeronave;

        switch (TipoDeAeronave) {
            case 'PequenoPorte':
                aeronave = new AeronaveParticular(
                    dadosAeronave[index].Prefixo,
                    Number(dadosAeronave[index].VelocidadeDeCruzeiro),
                    Number(dadosAeronave[index].Autonomia),
                    dadosAeronave[index].EmpresaDeManutencao
                );
                break;

            case 'ComercialDePassageiros':
                aeronave = new AeronavePassageiros(
                    dadosAeronave[index].Prefixo,
                    Number(dadosAeronave[index].VelocidadeDeCruzeiro),
                    Number(dadosAeronave[index].Autonomia),
                    dadosAeronave[index].CompanhiaAerea,
                    Number(dadosAeronave[index].CapacidadeDePassageiros)
                );
                break;

            case 'ComercialDeCarga':
                aeronave = new AeronaveCarga(
                    dadosAeronave[index].Prefixo,
                    Number(dadosAeronave[index].VelocidadeDeCruzeiro),
                    Number(dadosAeronave[index].Autonomia),
                    dadosAeronave[index].CompanhiaAerea,
                    Number(dadosAeronave[index].PesoMaximoDeCarga)
                );
                break;
            default:
                aeronave = new Aeronave(
                    dadosAeronave[index].Prefixo,
                    Number(dadosAeronave[index].VelocidadeDeCruzeiro),
                    Number(dadosAeronave[index].Autonomia)
                );
                break;
        }

        servicoAeronaves.adicionaAeronave(aeronave);
    }
}

/**
 * // cria as entidades de Planos para cada linha de dado recebida
 * @param {Array<Plano>} dadosPlanos array de dados dos Planos
 */
function criaPlanos(dadosPlanos) {
    for (let index = 0; index < dadosPlanos.length; index++) {
        const plano = new Plano(
            dadosPlanos[index].IdentificadorPlano,
            dadosPlanos[index].Identificador,
            dadosPlanos[index].AeroportoOrigem,
            dadosPlanos[index].AeroportoDestino,
            dadosPlanos[index].TamanhoAerovia,
            dadosPlanos[index].Altitude,
            dadosPlanos[index].SlotsTempo,
            dadosPlanos[index].EstadoAprovacao,
            dadosPlanos[index].Horario,
            dadosPlanos[index].NumeroDeMatriculaDoPiloto,
            dadosPlanos[index].prefixoAeronave,
            dadosPlanos[index].VelocidadeCruzeiro,
            dadosPlanos[index].DataPrevisao
        );

        servicoPlanos.adicionaPlano(plano)
    }
}

/**
 * // lida com o número da solicitação submetida pelo usuário
 * @param {Number} solicitacaoDopiloto 
 * @returns {void}
 */
function realizarFuncionalidadeEscolhidaPeloPiloto(solicitacaoDopiloto) {
    // verifica se o dado recebido é válido
    if (solicitacaoDopiloto < 1 || solicitacaoDopiloto > 8) {
        const solicitacaoDopiloto = Number(prompt("Escolha uma opção válida (1 - 8): "));

        // callback da função
        realizarFuncionalidadeEscolhidaPeloPiloto(solicitacaoDopiloto);
        return;
    }

    // executa a função para a opção escolhida pelo usuário 
    switch (solicitacaoDopiloto) {
        case 1:
            listarAeroviasComAsMesmasRotas();
            break;
        case 2:
            recuperarAltitudesLivres();
            break;
        case 3:
            submeterPlanoDeVoo();
            break;
        case 4:
            listaUmPlanoPeloNumero();
            break;
        case 5:
            listaPlanoPorData();
            break;
        case 6:
            listarAeroviasOcupadasPorData();
            break;
        case 7:
            cancelarPlanoDeVoo();
            break;
        case 8:
            reativarPlanoDeVoo();
            break;
    }
}

/**
 * Lista as informações das aerovias com as mesmas rotas entre um ponto de origem e um ponto de destino.
 * @returns {void}
 */
function listarAeroviasComAsMesmasRotas() {
    const origem = String(prompt("Digite o ponto de origem: "));
    const destino = String(prompt("Digite o ponto de destino: "));

    // Exibe no console as informações das aerovias com as mesmas rotas.
    console.log(servicoAerovias.recuperaInformacoesAeroviaComAMesmaRota(origem, destino));
}

/**
 * Recupera e exibe as altitudes livres em uma determinada aerovia em um horário específico.
 * @returns {void}
 */
function recuperarAltitudesLivres() {
    const origem = String(prompt("Digite o ponto de origem da rota que deseja verificar a disponibilidade (ex: POA): "));
    const destino = String(prompt("Digite o ponto de destino da rota que deseja verificar a disponibilidade (ex: CWB): "));
    const horarioInicio = Number(prompt("Digite o horário inicial da rota (digite apenas a hora 00 - 23): "));
    const horarioFinal = Number(prompt("Digite o horário final da rota (digite apenas a hora 00 - 23): "));

    const rota = `${origem}-${destino}`;

    // Cria uma string de horário no formato esperado.
    let horario = `${horarioInicio < 10 ? '0' + horarioInicio : horarioInicio}:00-${horarioFinal < 10 ? '0' + horarioFinal : horarioFinal}:00`;

    // Exibe no console as altitudes livres na aerovia para o horário especificado.
    console.log(servicoAerovias.listarAltitudesLivres(rota, horario));
}

/**
 * Submete um novo plano de voo para aprovação, verificando se atende aos requisitos necessários.
 * Exibe mensagens no console de acordo com o status da aprovação do plano de voo.
 * @returns {void}
 */
function submeterPlanoDeVoo() {

    // Cria um novo plano de voo a partir dos dados inseridos pelo usuário.
    const novoPlanoDeVoo = criaPlanoDeVooEmArquivo();

    // Verifica se a rota escolhida está aprovada para criação de planos.
    if (!verificaEstadoAerovia(novoPlanoDeVoo)) {
        console.log("==== A rota escolhida não está aprovada para criação de planos. Plano de voo não aprovado. ====");
        return;
    }

    // Verifica se a habilitação do piloto está ativa.
    if (!verificaHabilitacaoPiloto(novoPlanoDeVoo)) {
        console.log("==== Habilitação do piloto não está ativa. Plano de voo não aprovado. ====");
        return;
    }

    // Verifica se a autonomia da aeronave é suficiente.
    if (!verificaAutonomiaAeronave(novoPlanoDeVoo)) {
        console.log("==== Autonomia da aeronave não é suficiente. Plano de voo não aprovado. ====");
        return;
    }

    // Verifica se a altitude escolhida é compatível com o tipo de aeronave.
    if (!verificaAltitudeAeronave(novoPlanoDeVoo)) {
        console.log("==== Altitude escolhida não é compatível com o tipo de aeronave. Plano de voo não aprovado. ====");
        return;
    }

    // Verifica se os slots de horário necessários estão livres.
    if (!verificaSlotsTempoLivres(novoPlanoDeVoo)) {
        console.log("==== Os slots de horário necessários não estão livres. Plano de voo não aprovado. ====");
        return;
    }

    // Adiciona o novo plano de voo ao arquivo.
    adicionarPlanoDeVooAoArquivo(novoPlanoDeVoo);

    // Exibe uma mensagem informando que o plano de voo foi submetido e aprovado, incluindo o identificador.
    console.log(`==== Plano de voo submetido e aprovado. Identificador: ${novoPlanoDeVoo.IdentificadorPlano} ====`);
}

/**
 * Verifica se a habilitação do piloto associado ao plano de voo está ativa.
 * @param {Object} planoDeVoo - O plano de voo a ser verificado.
 * @returns {boolean} Retorna verdadeiro se a habilitação do piloto estiver ativa, caso contrário, retorna falso.
 */
function verificaHabilitacaoPiloto(planoDeVoo) {
    const piloto = servicoPiloto.recuperaInformacoesPiloto(planoDeVoo.NumeroDeMatriculaDoPiloto);
    return piloto[0].habilitacaoAtiva == 1;
}

/**
 * Verifica se a autonomia da aeronave associada ao plano de voo é suficiente para a rota planejada.
 * @param {Object} planoDeVoo - O plano de voo a ser verificado.
 * @returns {boolean} Retorna verdadeiro se a autonomia da aeronave for suficiente, caso contrário, retorna falso.
 */
function verificaAutonomiaAeronave(planoDeVoo) {
    const aeronave = servicoAeronaves.recuperaAeronavePorPrefixo(planoDeVoo.prefixoAeronave);

    return aeronave.autonomia >= planoDeVoo.TamanhoAerovia * 1.1;
}

/**
 * Verifica se a altitude escolhida no plano de voo é compatível com o tipo de aeronave associada.
 * @param {Object} planoDeVoo - O plano de voo a ser verificado.
 * @returns {boolean} Retorna verdadeiro se a altitude for compatível, caso contrário, retorna falso.
 */
function verificaAltitudeAeronave(planoDeVoo) {
    const aeronave = servicoAeronaves.recuperaAeronavePorPrefixo(planoDeVoo.prefixoAeronave);

    const alturaMinima = Number(planoDeVoo.Altitude.split('-')[0]);
    const alturaMaxima = Number(planoDeVoo.Altitude.split('-')[1]);

    return (
        (aeronave.respManutencao != 'Esse tipo de aeronave não possui essa informação.' && (alturaMinima >= 25000 && alturaMaxima >= 25000) && (alturaMinima <= 27000 && alturaMaxima <= 27000)) ||
        (aeronave.maxPassageiros != 'Esse tipo de aeronave não possui essa informação.' && (alturaMinima >= 28000 && alturaMaxima >= 28000)) ||
        (aeronave.pesoMax != 'Esse tipo de aeronave não possui essa informação.' && (alturaMinima >= 25000 && alturaMaxima >= 25000) && (alturaMinima <= 35000 && alturaMaxima <= 35000))
    );
}

/**
 * Verifica se existem slots de tempo livres suficientes em todas as aerovias da rota para o plano de voo.
 * @param {Object} planoDeVoo - O plano de voo a ser verificado.
 * @returns {boolean} Retorna verdadeiro se houver slots de tempo suficientes, caso contrário, retorna falso.
 */
function verificaSlotsTempoLivres(planoDeVoo) {
    // Recupera as aerovias associadas à rota do plano de voo.
    const aerovias = servicoAerovias.recuperaAeroviasPorRota(planoDeVoo.Identificador);

    // Calcula o número de slots necessários com base no tamanho da aerovia e na velocidade de cruzeiro do plano de voo.
    const slotsNecessarios = Math.ceil(planoDeVoo.TamanhoAerovia / planoDeVoo.VelocidadeCruzeiro);

    // Verifica se há slots de tempo livres suficientes em todas as aerovias da rota.
    return aerovias.every(aerovia => {
        // Lista as altitudes livres na aerovia para o horário especificado no plano de voo.
        const altitudesLivres = servicoAerovias.listarAltitudesLivres(aerovia.Identificador, planoDeVoo.Horario);
        return altitudesLivres.length >= slotsNecessarios;
    });
}

/**
 * Verifica se o estado da primeira aerovia associada à rota do plano de voo está aprovado.
 * @param {Object} planoDeVoo - O plano de voo a ser verificado.
 * @returns {boolean} Retorna verdadeiro se o estado da aerovia estiver aprovado, caso contrário, retorna falso.
 */
function verificaEstadoAerovia(planoDeVoo) {
    const aerovias = servicoAerovias.recuperaAeroviasPorRota(planoDeVoo.Identificador);
    return aerovias[0].EstadoAprovacao == 'Aprovada';
}

/**
 * Cria um novo plano de voo com base nas informações fornecidas pelo usuário.
 * @returns {Object} Retorna um objeto representando o novo plano de voo.
 */
function criaPlanoDeVooEmArquivo() {

    // Solicita ao usuário as informações necessárias para criar o plano de voo.
    const IdentificadorPlano = servicoPlanos.mostrarTodosOsPlanos();
    const Identificador = String(prompt("Digite o identificador da aerovia (ex: POA-CWB): "));
    const origem = String(prompt("Digite o aeroporto de origem: "));
    const destino = String(prompt("Digite o aeroporto de destino: "));
    const tamanho = Number(prompt("Digite o tamanho da aerovia em quilômetros: "));
    const altitude = String(prompt("Digite a altitude da aerovia (ex: 28000-29000): "));
    const slotsTempo = Number(prompt("Digite a quantidade de slots de tempo necessários: "));
    const estadoAprovacao = 1;
    const horarioInicio = Number(prompt("Digite o horário inicial da rota (digite apenas a hora 00 - 23): "));
    const horarioFinal = Number(prompt("Digite o horário final da rota (digite apenas a hora 00 - 23): "));
    const NumeroDeMatriculaDoPiloto = String(prompt("Digite a matricula do Piloto: "));
    const prefixoAeronave = String(prompt("Digite o prefixo da aeronave que deseja (ex: CM789): "));
    const VelocidadeCruzeiro = Number(prompt("Digite a Velocidade de Cruzeiro da aeronave que deseja (km/h): "));
    const DataPrevisao = String(prompt("Digite a data prevista do plano (ex: dd/mm/aaaa): "));

    // Retorna um objeto representando o novo plano de voo.
    return {
        IdentificadorPlano: parseInt(IdentificadorPlano[IdentificadorPlano.length - 1].IdentificadorPlano) + 1,
        Identificador: Identificador,
        AeroportoOrigem: origem,
        AeroportoDestino: destino,
        TamanhoAerovia: tamanho,
        Altitude: altitude,
        SlotsTempo: slotsTempo,
        EstadoAprovacao: estadoAprovacao,
        Horario: horarioInicio + ':00' + '-' + horarioFinal + ':00',
        NumeroDeMatriculaDoPiloto: NumeroDeMatriculaDoPiloto,
        prefixoAeronave: prefixoAeronave,
        VelocidadeCruzeiro: VelocidadeCruzeiro,
        DataPrevisao: DataPrevisao
    };
}

/**
 * Adiciona um novo plano de voo ao arquivo CSV de planos de voo.
 * @param {Object} planoDeVoo - O plano de voo a ser adicionado ao arquivo.
 * @returns {void}
 */
function adicionarPlanoDeVooAoArquivo(planoDeVoo) {
    const caminhoArquivo = './data/planosVoo.csv';

    let novaLinhaCSV = `${planoDeVoo.IdentificadorPlano},${planoDeVoo.Identificador},${planoDeVoo.AeroportoOrigem},${planoDeVoo.AeroportoDestino},${planoDeVoo.TamanhoAerovia},${planoDeVoo.Altitude},${planoDeVoo.SlotsTempo},${planoDeVoo.EstadoAprovacao},${planoDeVoo.Horario},${planoDeVoo.NumeroDeMatriculaDoPiloto},${planoDeVoo.prefixoAeronave},${planoDeVoo.VelocidadeCruzeiro},${planoDeVoo.DataPrevisao}\n`;

    // Verifica se o arquivo já existe e decide se deve ser acrescentado ou criado.
    (existsSync(caminhoArquivo)) ? appendFileSync(caminhoArquivo, novaLinhaCSV, 'utf8') : writeFileSync(caminhoArquivo, novaLinhaCSV, 'utf8');
}

/**
 * Lista as informações de um plano de voo com base no número identificador fornecido.
 * @returns {void}
 */
function listaUmPlanoPeloNumero() {
    const IdentificadorPlano = String(prompt("Digite o número identificador do plano: "));

    // Recupera e exibe as informações do plano de voo com base no número identificador.
    console.log(servicoPlanos.recuperaInformacoesPlano(IdentificadorPlano));
}

/**
 * Lista os planos de voo com base na data fornecida.
 * @returns {void}
 */
function listaPlanoPorData() {
    // A data para a qual se deseja listar os planos de voo (no formato dd/mm/aaaa).
    const Data = String(prompt("Digite a data que deseja do plano (ex: dd/mm/aaaa): "));

    // Recupera e exibe os planos de voo com base na data fornecida.
    console.log(servicoPlanos.listaPlanosPorData(Data));
}

/**
 * Lista as aerovias ocupadas com base na rota e data fornecidas.
 * @returns {void}
 */
function listarAeroviasOcupadasPorData() {
    const origem = String(prompt("Digite o ponto de origem da rota que deseja verificar a disponibilidade (ex: POA): "));
    const destino = String(prompt("Digite o ponto de destino da rota que deseja verificar a disponibilidade (ex: CWB): "));
    const data = String(prompt("Digite a data que deseja do verificar a disponibilidade da aerovia (ex: dd/mm/aaaa): "));

    // A rota composta pelos pontos de origem e destino (ex: POA-CWB).
    const rota = `${origem}-${destino}`;

    console.log(servicoAerovias.listarAeroviasOcupadasPorData(rota, data));
}

/**
 * Cancela um plano de voo, alterando seu estado de aprovação para cancelado no arquivo CSV.
 * @async
 * @returns {Promise<void>}
 */
async function cancelarPlanoDeVoo() {
    // O caminho do arquivo CSV que contém os planos de voo.
    const caminhoArquivo = './data/planosVoo.csv';

    // O identificador do plano de voo que deseja cancelar (ex: 1)
    const identificadorAlvo = prompt('Digite o identificador do plano de voo que deseja cancelar (ex: 1): ');

    // O novo valor para o estado de aprovação do plano de voo (0 para cancelado).
    const novoValor = '0';

    // O número da coluna a ser alterada no arquivo CSV (7 para o estado de aprovação).
    const colunaAlterada = 7;

    // Confirmação do usuário para cancelar o plano de voo (1 - sim, 0 - não).
    const confirmacao = prompt(`Você tem certeza que deseja cancelar o plano de voo: ${identificadorAlvo} (1 - sim, 0 - não)? `)

    if (confirmacao == 1) {
        console.log(`Plano de voo: ${identificadorAlvo}, será alterado assim que o sistema encerrar`);
        await alterarDadoNoCSV(caminhoArquivo, identificadorAlvo, novoValor, colunaAlterada);
    } else {
        console.log('Nenhum Plano de voo cancelado.')
    }
}

/**
 * Reativa um plano de voo, alterando seu estado de aprovação para ativo no arquivo CSV.
 * @async
 * @returns {Promise<void>}
 */
async function reativarPlanoDeVoo() {
    const caminhoArquivo = './data/planosVoo.csv';
    const identificadorAlvo = prompt('Digite o identificador do plano de voo que deseja reativar (ex: 1): ');
    const novoValor = '1';
    const colunaAlterada = 7;

    const confirmacao = prompt(`Você tem certeza que deseja reativar o plano de voo: ${identificadorAlvo} (1 - sim, 0 - não)? `)

    if (confirmacao == 1) {
        console.log(`Plano de voo: ${identificadorAlvo}, será alterado assim que o sistema encerrar`);
        await alterarDadoNoCSV(caminhoArquivo, identificadorAlvo, novoValor, colunaAlterada);
    } else {
        console.log('Nenhum Plano de voo reativado.')
    }
}

/**
 * Altera o valor de uma coluna específica para um identificador de plano de voo no arquivo CSV.
 * @async
 * @param {string} caminhoArquivo - O caminho do arquivo CSV que contém os planos de voo.
 * @param {string} identificadorAlvo - O identificador do plano de voo que terá seu valor alterado.
 * @param {string} novoValor - O novo valor para a coluna especificada.
 * @param {number} colunaAlterada - O número da coluna a ser alterada no arquivo CSV.
 * @returns {Promise<void>}
 */
async function alterarDadoNoCSV(caminhoArquivo, identificadorAlvo, novoValor, colunaAlterada) {
    try {
        const conteudo = await readFile(caminhoArquivo, 'utf-8');
        const linhas = conteudo.split('\n');
        const indiceLinha = linhas.findIndex(linha => linha.split(',')[0].includes(identificadorAlvo));

        if (indiceLinha !== -1) {
            const colunas = linhas[indiceLinha].split(',');
            const indiceColuna = colunaAlterada;

            colunas[indiceColuna] = novoValor;
            linhas[indiceLinha] = colunas.join(',');

            const novoConteudo = linhas.join('\n');

            await writeFile(caminhoArquivo, novoConteudo, { encoding: 'utf-8' });

            console.log(`Plano de voo alterado com sucesso: Plano de Voo (${identificadorAlvo})`);
        } else {
            console.log(`Plano de voo não encontrado: ${identificadorAlvo}`);
        }
    } catch (erro) {
        console.error('Erro ao tentar alterar o dado:', erro);
    }
}

/**
 * Finaliza o programa após solicitar ao usuário se deseja fazer outra pergunta.
 * @returns {void}
 */
function end() {
    const continuar = Number(prompt("Fazer outra pergunta? (1 - sim, 2 - não) "));

    if (continuar == 1) {
        start();
    } else {
        console.log(`\n\n==== Programa finalizado! Até outra hora. ====\n\n`)
    }
}
