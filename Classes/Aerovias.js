import { validate } from 'bycontract';
import { servicoPlanos } from './Planos.js';

/**
 * Representa uma instância da classe Aerovias que descreve informações sobre uma aerovia.
 * @class
 * @classdesc Esta classe contém propriedades e métodos relacionados a um aerovias.
 */
export class Aerovias {
    #Identificador;
    #AeroportoDeOrigem;
    #AeroportoDeDestino;
    #TamanhoDaAerovia;
    #Altitude;
    #SlotsDeTempo;
    #EstadoAprovacao;
    #horario;

    constructor(Identificador, AeroportoDeOrigem, AeroportoDeDestino, TamanhoDaAerovia, Altitude, SlotsDeTempo, EstadoAprovacao, horario) {
        this.#Identificador = Identificador
        this.#AeroportoDeOrigem = AeroportoDeOrigem;
        this.#AeroportoDeDestino = AeroportoDeDestino;
        this.#TamanhoDaAerovia = TamanhoDaAerovia;
        this.#Altitude = Altitude;
        this.#SlotsDeTempo = SlotsDeTempo;
        this.#EstadoAprovacao = EstadoAprovacao;
        this.#horario = horario;
    }

    // Getters para acessar as informações da aerovia
    get Identificador() {
        return this.#Identificador;
    }

    get AeroportoDeOrigem() {
        return this.#AeroportoDeOrigem;
    }

    get AeroportoDeDestino() {
        return this.#AeroportoDeDestino;
    }

    get TamanhoDaAerovia() {
        return this.#TamanhoDaAerovia;
    }

    get Altitude() {
        return this.#Altitude;
    }

    get SlotsDeTempo() {
        return this.#SlotsDeTempo;
    }

    get EstadoAprovacao() {
        return this.#EstadoAprovacao;
    }

    get horario() {
        return this.#horario;
    }
}

/**
 * Representa uma instância da classe ServicoAerovias responsável por gerenciar informações sobre aerovias.
 *
 * @class
 * @classdesc Esta classe contém métodos para adicionar, recuperar e listar informações relacionadas a aerovias.
 */
export class ServicoAerovias {
    aerovias;

    constructor() {
        this.aerovias = [];
    }

    // Método para adicionar uma aerovia
    adicionaAerovias(aerovia) {
        validate(aerovia, Aerovias);

        this.aerovias.push(aerovia);
    }

    // Método para recuperar as informações das aerovia com a mesma rota
    recuperaInformacoesAeroviaComAMesmaRota(origem, destino) {
        validate([origem, destino], ["String", "String"]);

        const aeroviasEncontradas = this.aerovias.filter(aerovia => aerovia.AeroportoDeOrigem === origem && aerovia.AeroportoDeDestino === destino);

        return aeroviasEncontradas.map(aerovia => ({
            Identificador: aerovia.Identificador,
            AeroportoDeOrigem: aerovia.AeroportoDeOrigem,
            AeroportoDeDestino: aerovia.AeroportoDeDestino,
            TamanhoDaAerovia: aerovia.TamanhoDaAerovia,
            Altitude: aerovia.Altitude,
            SlotsDeTempo: aerovia.SlotsDeTempo,
            EstadoAprovacao: aerovia.EstadoAprovacao == 1 ? 'Aprovada' : 'Não Aprovada',
            horario: aerovia.horario
        }));
    }

    recuperaAeroviasPorRota(rota) {
        validate(rota, "String");

        const aeroviasEncontradas = this.aerovias.filter(aerovia => aerovia.Identificador === rota);

        return aeroviasEncontradas.map(aerovia => ({
            Identificador: aerovia.Identificador,
            AeroportoDeOrigem: aerovia.AeroportoDeOrigem,
            AeroportoDeDestino: aerovia.AeroportoDeDestino,
            TamanhoDaAerovia: aerovia.TamanhoDaAerovia,
            Altitude: aerovia.Altitude,
            SlotsDeTempo: aerovia.SlotsDeTempo,
            EstadoAprovacao: aerovia.EstadoAprovacao == 1 ? 'Aprovada' : 'Não Aprovada',
            horario: aerovia.horario,
            data: aerovia.data
        }));
    }

    listarAeroviasOcupadasPorData(rota, data) {
        validate(rota, "String");

        let planos = [];
        for (let i = 0; i < servicoPlanos.mostrarTodosOsPlanos().length; i++) {
            planos.push({
                data: servicoPlanos.mostrarTodosOsPlanos()[i].DataPrevisao,
                estado: servicoPlanos.mostrarTodosOsPlanos()[i].EstadoAprovacao
            });
        }

        const aeroviasEncontradas = this.aerovias.filter(aerovia => aerovia.Identificador === rota && planos.some(plano => plano.data === data && plano.estado === 1) === true && aerovia.EstadoAprovacao == 1);

        if (aeroviasEncontradas.length != 0) {
            return aeroviasEncontradas.map(aerovia => ({
                Identificador: aerovia.Identificador,
                AeroportoDeOrigem: aerovia.AeroportoDeOrigem,
                AeroportoDeDestino: aerovia.AeroportoDeDestino,
                TamanhoDaAerovia: aerovia.TamanhoDaAerovia,
                Altitude: aerovia.Altitude,
                SlotsDeTempo: aerovia.SlotsDeTempo,
                EstadoAprovacao: aerovia.EstadoAprovacao == 1 ? 'Aprovada' : 'Não Aprovada',
                horario: aerovia.horario,
            }));
        } else {
            return 'Rota Disponível, nenhuma aerovia com a mesma rota encontrada nessa data!'
        }

    }

    recuperaInformacoesAeroviaAprovadas() {
        const aeroviasEncontradas = this.aerovias.filter(aerovia => aerovia.EstadoAprovacao === 1);

        return aeroviasEncontradas.map(aerovia => ({
            Identificador: aerovia.Identificador,
            AeroportoDeOrigem: aerovia.AeroportoDeOrigem,
            AeroportoDeDestino: aerovia.AeroportoDeDestino,
            TamanhoDaAerovia: aerovia.TamanhoDaAerovia,
            Altitude: aerovia.Altitude,
            SlotsDeTempo: aerovia.SlotsDeTempo,
            EstadoAprovacao: aerovia.EstadoAprovacao == 1 ? 'Aprovada' : 'Não Aprovada',
            horario: aerovia.horario,
        }));
    }

    listarAltitudesLivres(rota, horario) {
        validate(rota, "String");

        const aeroviasEncontradas = this.aerovias.filter(aerovia => aerovia.Identificador === rota && aerovia.horario === horario && aerovia.EstadoAprovacao == 1);

        let aeroviasOcupadas = [];
        aeroviasEncontradas.forEach(aerovia => aeroviasOcupadas.push(aerovia.Altitude))

        let altitudesDisponíveis = []
        for (let i = 25000; i < 35000; i += 1000) {
            altitudesDisponíveis.push(`${i}-${i + 1000}`)
        }

        const altitudesLivres = altitudesDisponíveis.filter(altitude => !aeroviasOcupadas.includes(altitude));

        return altitudesLivres.map(altitude => ({
            rota: rota,
            horario: horario,
            altitude: altitude
        }));
    }

    // Método para listar todas as aerovias disponíveis
    listaTodasAsAerovias() {
        return this.aerovias.map(aerovia => ({
            Identificador: aerovia.Identificador,
            AeroportoDeOrigem: aerovia.AeroportoDeOrigem,
            AeroportoDeDestino: aerovia.AeroportoDeDestino,
            TamanhoDaAerovia: aerovia.TamanhoDaAerovia,
            Altitude: aerovia.Altitude,
            SlotsDeTempo: aerovia.SlotsDeTempo,
            EstadoAprovacao: aerovia.EstadoAprovacao == 1 ? 'Aprovada' : 'Não Aprovada',
            horario: aerovia.horario,
        }));
    }
}

export const servicoAerovias = new ServicoAerovias();