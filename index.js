import PromptSync from "prompt-sync";
import nReadlines from "n-readlines";
import { readFile, writeFile } from 'fs/promises';
import { appendFileSync, existsSync, writeFileSync } from "fs";

import { Piloto, ServicoPilotos } from "./Classes/Piloto.js";
import { Aerovias, ServicoAerovias } from "./Classes/Aerovias.js";
import { Aeronave, AeronaveCarga, AeronaveParticular, AeronavePassageiros, ServicoAeronave } from "./Classes/Aeronave.js";
import { Plano, ServicoPlanos } from "./Classes/Planos.js";

const servicoPiloto = new ServicoPilotos();
const servicoAerovias = new ServicoAerovias();
const servicoAeronaves = new ServicoAeronave();
const servicoPlanos = new ServicoPlanos();

const prompt = PromptSync({ sigint: true });

function start() {
    const dadosPiloto = carregaDados('./data/piloto.csv', 'piloto');
    const dadosAerovias = carregaDados('./data/aerovias.csv', 'aerovia');
    const dadosAeronave = carregaDados('./data/aeronave.csv', 'aeronave');
    const dadosPlanos = carregaDados('./data/planosVoo.csv', 'planos');

    criaPilotos(dadosPiloto);
    criaAerovias(dadosAerovias);
    criaAeronaves(dadosAeronave);
    criaPlanos(dadosPlanos);

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

    const solicitacaoDopiloto = Number(prompt(`====== O que você deseja? =======\n\n${opcoes[0]}\n${opcoes[1]}\n${opcoes[2]}\n${opcoes[3]}\n${opcoes[4]}\n${opcoes[5]}\n${opcoes[6]}\n${opcoes[7]}\n\nEscolha uma opção (1 - 8): `))
    realizarFuncionalidadeEscolhidaPeloPiloto(solicitacaoDopiloto);

    end();
};

start();

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
                    "horario": dado[7].trim(),
                    "data": dado[8].trim()
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
            dadosAerovias[index].horario,
            dadosAerovias[index].data
        );

        servicoAerovias.adicionaAerovias(aerovia);
    }
}

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

function realizarFuncionalidadeEscolhidaPeloPiloto(solicitacaoDopiloto) {
    if (solicitacaoDopiloto < 1 || solicitacaoDopiloto > 8) {
        const solicitacaoDopiloto = Number(prompt("Escolha uma opção válida (1 - 8): "));

        realizarFuncionalidadeEscolhidaPeloPiloto(solicitacaoDopiloto);
        return;
    }

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

function listarAeroviasComAsMesmasRotas() {
    const origem = String(prompt("Digite o ponto de origem: "));
    const destino = String(prompt("Digite o ponto de destino: "));

    console.log(servicoAerovias.recuperaInformacoesAeroviaComAMesmaRota(origem, destino));
}

function recuperarAltitudesLivres() {
    const origem = String(prompt("Digite o ponto de origem da rota que deseja verificar a disponibilidade (ex: POA): "));
    const destino = String(prompt("Digite o ponto de destino da rota que deseja verificar a disponibilidade (ex: CBW): "));
    const horarioInicio = Number(prompt("Digite o horário inicial da rota (digite apenas a hora 00 - 23): "));
    const horarioFinal = Number(prompt("Digite o horário final da rota (digite apenas a hora 00 - 23): "));

    const rota = `${origem}-${destino}`;

    let horario = `${horarioInicio < 10 ? '0' + horarioInicio : horarioInicio}:00-${horarioFinal < 10 ? '0' + horarioFinal : horarioFinal}:00`;

    console.log(servicoAerovias.listarAltitudesLivres(rota, horario));
}

function submeterPlanoDeVoo() {
    const novoPlanoDeVoo = criaPlanoDeVooEmArquivo();

    if (!verificaHabilitacaoPiloto(novoPlanoDeVoo)) {
        console.log("==== Habilitação do piloto não está ativa. Plano de voo não aprovado. ====");
        return;
    }

    if (!verificaAutonomiaAeronave(novoPlanoDeVoo)) {
        console.log("==== Autonomia da aeronave não é suficiente. Plano de voo não aprovado. ====");
        return;
    }

    if (!verificaAltitudeAeronave(novoPlanoDeVoo)) {
        console.log("==== Altitude escolhida não é compatível com o tipo de aeronave. Plano de voo não aprovado. ====");
        return;
    }

    if (!verificaSlotsTempoLivres(novoPlanoDeVoo)) {
        console.log("==== Os slots de horário necessários não estão livres. Plano de voo não aprovado. ====");
        return;
    }

    adicionarPlanoDeVooAoArquivo(novoPlanoDeVoo);

    console.log(`==== Plano de voo submetido e aprovado. Identificador: ${novoPlanoDeVoo.IdentificadorPlano} ====`);
}

function verificaHabilitacaoPiloto(planoDeVoo) {
    const piloto = servicoPiloto.recuperaInformacoesPiloto(planoDeVoo.NumeroDeMatriculaDoPiloto);
    return piloto[0].habilitacaoAtiva == 1;
}

function verificaAutonomiaAeronave(planoDeVoo) {
    const aeronave = servicoAeronaves.recuperaAeronavePorPrefixo(planoDeVoo.prefixoAeronave);

    return aeronave.autonomia >= planoDeVoo.TamanhoAerovia * 1.1;
}

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

function verificaSlotsTempoLivres(planoDeVoo) {
    const aerovias = servicoAerovias.recuperaAeroviasPorRota(planoDeVoo.Identificador);

    const slotsNecessarios = Math.ceil(planoDeVoo.TamanhoAerovia / planoDeVoo.VelocidadeCruzeiro);

    return aerovias.every(aerovia => {
        const altitudesLivres = servicoAerovias.listarAltitudesLivres(aerovia.Identificador, planoDeVoo.Horario);
        return altitudesLivres.length >= slotsNecessarios;
    });
}

function criaPlanoDeVooEmArquivo() {
    const IdentificadorPlano = servicoPlanos.mostrarTodosOsPilotos();
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

function adicionarPlanoDeVooAoArquivo(planoDeVoo) {
    const caminhoArquivo = './data/planosVoo.csv';

    let novaLinhaCSV = `${planoDeVoo.IdentificadorPlano},${planoDeVoo.Identificador},${planoDeVoo.AeroportoOrigem},${planoDeVoo.AeroportoDestino},${planoDeVoo.TamanhoAerovia},${planoDeVoo.Altitude},${planoDeVoo.SlotsTempo},${planoDeVoo.EstadoAprovacao},${planoDeVoo.Horario},${planoDeVoo.NumeroDeMatriculaDoPiloto},${planoDeVoo.prefixoAeronave},${planoDeVoo.VelocidadeCruzeiro},${planoDeVoo.DataPrevisao}\n`;

    (existsSync(caminhoArquivo)) ? appendFileSync(caminhoArquivo, novaLinhaCSV, 'utf8') : writeFileSync(caminhoArquivo, novaLinhaCSV, 'utf8');
}

function listaUmPlanoPeloNumero() {
    const IdentificadorPlano = String(prompt("Digite o número identificador do plano: "));

    console.log(servicoPlanos.recuperaInformacoesPlano(IdentificadorPlano));
}

function listaPlanoPorData() {
    const Data = String(prompt("Digite a data que deseja do plano (ex: dd/mm/aaaa): "));

    console.log(servicoPlanos.listaPlanosPorData(Data));
}

function listarAeroviasOcupadasPorData() {
    const origem = String(prompt("Digite o ponto de origem da rota que deseja verificar a disponibilidade (ex: POA): "));
    const destino = String(prompt("Digite o ponto de destino da rota que deseja verificar a disponibilidade (ex: CBW): "));
    const data = String(prompt("Digite a data que deseja do verificar a disponibilidade da aerovia (ex: dd/mm/aaaa): "));

    const rota = `${origem}-${destino}`;

    console.log(servicoAerovias.listarAeroviasOcupadasPorData(rota, data));
}

async function cancelarPlanoDeVoo() {
    const caminhoArquivo = './data/planosVoo.csv';
    const identificadorAlvo = prompt('Digite o identificador do plano de voo que deseja cancelar (ex: 1): ');
    const novoValor = '0';
    const colunaAlterada = 7;

    const confirmacao = prompt(`Você tem certeza que deseja cancelar o plano de voo: ${identificadorAlvo} (1 - sim, 0 - não)? `)

    if (confirmacao == 1) {
        console.log(`Plano de voo: ${identificadorAlvo}, será alterado assim que o sistema encerrar`);
        await alterarDadoNoCSV(caminhoArquivo, identificadorAlvo, novoValor, colunaAlterada);
    } else {
        console.log('Nenhum Plano de voo cancelado.')
    }
}

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

function end() {
    const continuar = Number(prompt("Fazer outra pergunta? (1 - sim, 2 - não) "));

    if (continuar == 1) {
        start();
    } else {
        console.log(`\n\n==== Programa finalizado! Até outra hora. ====\n\n`)
    }
}
