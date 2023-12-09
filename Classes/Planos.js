import { validate } from 'bycontract';

// Definição da classe Planos
export class Plano {
    #IdentificadorPlano;
    #Identificador;
    #AeroportoOrigem;
    #AeroportoDestino;
    #TamanhoAerovia;
    #Altitude;
    #SlotsTempo;
    #EstadoAprovacao;
    #Horario;
    #NumeroDeMatriculaDoPiloto;
    #prefixoAeronave;
    #VelocidadeCruzeiro;
    #DataPrevisao;

    constructor(IdentificadorPlano, Identificador, AeroportoOrigem, AeroportoDestino, TamanhoAerovia, Altitude, SlotsTempo, EstadoAprovacao, Horario, NumeroDeMatriculaDoPiloto, prefixoAeronave, VelocidadeCruzeiro, DataPrevisao) {
        this.#IdentificadorPlano = IdentificadorPlano;
        this.#Identificador = Identificador;
        this.#AeroportoOrigem = AeroportoOrigem;
        this.#AeroportoDestino = AeroportoDestino;
        this.#TamanhoAerovia = TamanhoAerovia;
        this.#Altitude = Altitude;
        this.#SlotsTempo = SlotsTempo;
        this.#EstadoAprovacao = EstadoAprovacao;
        this.#Horario = Horario;
        this.#NumeroDeMatriculaDoPiloto = NumeroDeMatriculaDoPiloto;
        this.#prefixoAeronave = prefixoAeronave;
        this.#VelocidadeCruzeiro = VelocidadeCruzeiro;
        this.#DataPrevisao = DataPrevisao;
    }

    get IdentificadorPlano() {
        return this.#IdentificadorPlano;
    }

    get Identificador() {
        return this.#Identificador;
    }

    get AeroportoOrigem() {
        return this.#AeroportoOrigem;
    }

    get AeroportoDestino() {
        return this.#AeroportoDestino;
    }

    get TamanhoAerovia() {
        return this.#TamanhoAerovia;
    }

    get Altitude() {
        return this.#Altitude;
    }

    get SlotsTempo() {
        return this.#SlotsTempo;
    }

    get EstadoAprovacao() {
        return this.#EstadoAprovacao;
    }

    get Horario() {
        return this.#Horario;
    }

    get NumeroDeMatriculaDoPiloto() {
        return this.#NumeroDeMatriculaDoPiloto;
    }

    get prefixoAeronave() {
        return this.#prefixoAeronave;
    }

    get VelocidadeCruzeiro() {
        return this.#VelocidadeCruzeiro;
    }

    get DataPrevisao() {
        return this.#DataPrevisao;
    }
}

export class ServicoPlanos {
    plano;

    constructor() {
        this.planos = [];
    }

    adicionaPlano(plano) {
        validate(plano, Plano);

        this.planos.push(plano)
    }

    recuperaInformacoesPlano(IdentificadorPlano) {
        const planosEncontrados = this.planos.filter(plano => plano.IdentificadorPlano === IdentificadorPlano);

        return planosEncontrados.map(plano => ({
            "IdentificadorPlano": plano.IdentificadorPlano,
            "Identificador": plano.Identificador,
            "AeroportoOrigem": plano.AeroportoOrigem,
            "AeroportoDestino": plano.AeroportoDestino,
            "TamanhoAerovia": plano.TamanhoAerovia,
            "Altitude": plano.Altitude,
            "SlotsTempo": plano.SlotsTempo,
            "EstadoAprovacao": plano.EstadoAprovacao,
            "Horario": plano.Horario,
            "NumeroDeMatriculaDoPiloto": plano.NumeroDeMatriculaDoPiloto,
            "prefixoAeronave": plano.prefixoAeronave,
            "VelocidadeCruzeiro": plano.VelocidadeCruzeiro,
            "DataPrevisao": plano.DataPrevisao
        }));
    }

    listaPlanosPorData(Data) {
        const planosEncontrados = this.planos.filter(plano => plano.DataPrevisao === Data);

        return planosEncontrados.map(plano => ({
            "IdentificadorPlano": plano.IdentificadorPlano,
            "Identificador": plano.Identificador,
            "AeroportoOrigem": plano.AeroportoOrigem,
            "AeroportoDestino": plano.AeroportoDestino,
            "TamanhoAerovia": plano.TamanhoAerovia,
            "Altitude": plano.Altitude,
            "SlotsTempo": plano.SlotsTempo,
            "EstadoAprovacao": plano.EstadoAprovacao,
            "Horario": plano.Horario,
            "NumeroDeMatriculaDoPiloto": plano.NumeroDeMatriculaDoPiloto,
            "prefixoAeronave": plano.prefixoAeronave,
            "VelocidadeCruzeiro": plano.VelocidadeCruzeiro,
            "DataPrevisao": plano.DataPrevisao
        }));
    }

    mostrarTodosOsPilotos() {
        return this.planos.map(plano => ({
            "IdentificadorPlano": plano.IdentificadorPlano,
            "Identificador": plano.Identificador,
            "AeroportoOrigem": plano.AeroportoOrigem,
            "AeroportoDestino": plano.AeroportoDestino,
            "TamanhoAerovia": plano.TamanhoAerovia,
            "Altitude": plano.Altitude,
            "SlotsTempo": plano.SlotsTempo,
            "EstadoAprovacao": plano.EstadoAprovacao,
            "Horario": plano.Horario,
            "NumeroDeMatriculaDoPiloto": plano.NumeroDeMatriculaDoPiloto,
            "prefixoAeronave": plano.prefixoAeronave,
            "VelocidadeCruzeiro": plano.VelocidadeCruzeiro,
            "DataPrevisao": plano.DataPrevisao
        }));
    }
}