import { validate } from 'bycontract';

/**
 * Representa uma aeronave com informações como prefixo, velocidade de cruzeiro e autonomia.
 * @class
 */
export class Aeronave {
    #prefixo;
    #velociadeCruzeiro;
    #autonomia;

    constructor(prefixo, velociadeCruzeiro, autonomia) {
        validate([prefixo, velociadeCruzeiro, autonomia], ["String", "Number", "Number"])

        this.#prefixo = prefixo;
        this.#velociadeCruzeiro = velociadeCruzeiro;
        this.#autonomia = autonomia;
    }

    // Getters para acessar as informações da aeronave
    get prefixo() {
        return this.#prefixo;
    }

    get velociadeCruzeiro() {
        return this.#velociadeCruzeiro;
    }

    get autonomia() {
        return this.#autonomia;
    }
}

/**
 * Representa uma aeronave particular que herda da classe Aeronave.
 * @class
 */
export class AeronaveParticular extends Aeronave {
    #respManutencao

    constructor(prefixo, velociadeCruzeiro, autonomia, respManutencao) {
        validate(respManutencao, "String");

        super(prefixo, velociadeCruzeiro, autonomia);

        this.#respManutencao = respManutencao;
    }

    // Getters para acessar as informações da aeronave
    get respManutencao() {
        return this.#respManutencao;
    }
}

/**
 * Representa uma aeronave comercial que herda da classe Aeronave.
 * @class
 */
export class AeronaveComercial extends Aeronave {
    #nomeCIA

    constructor(prefixo, velociadeCruzeiro, autonomia, nomeCIA) {
        validate(nomeCIA, "String");

        super(prefixo, velociadeCruzeiro, autonomia);

        this.#nomeCIA = nomeCIA;
    }

    // Getters para acessar as informações da aeronave
    get nomeCIA() {
        return this.#nomeCIA;
    }
}

/**
 * Representa uma aeronave de passageiros que herda da classe AeronaveComercial.
 * @class
 */
export class AeronavePassageiros extends AeronaveComercial {
    #maxPassageiros

    constructor(prefixo, velociadeCruzeiro, autonomia, nomeCIA, maxPassageiros) {
        validate(maxPassageiros, "Number");

        super(prefixo, velociadeCruzeiro, autonomia, nomeCIA);

        this.#maxPassageiros = maxPassageiros;
    }

    // Getters para acessar as informações da aeronave
    get maxPassageiros() {
        return this.#maxPassageiros;
    }
}

/**
 * Representa uma aeronave de carga que herda da classe AeronaveComercial.
 * @class
 */
export class AeronaveCarga extends AeronaveComercial {
    #pesoMax

    constructor(prefixo, velociadeCruzeiro, autonomia, nomeCIA, pesoMax) {
        validate(pesoMax, "Number");

        super(prefixo, velociadeCruzeiro, autonomia, nomeCIA);

        this.#pesoMax = pesoMax;
    }
    // Getters para acessar as informações da aeronave
    get pesoMax() {
        return this.#pesoMax;
    }
}

/**
 * Serviço para gerenciar informações relacionadas a aeronaves.
 * @class
 */
export class ServicoAeronave {
    aeronaves;

    /**
  * Construtor da classe ServicoAeronave.
  * Inicializa a lista de aeronaves.
  */
    constructor() {
        this.aeronaves = []
    }

    /**
     * Adiciona uma aeronave à lista de aeronaves.
     * @param {Aeronave} aeronave - Instância da classe Aeronave a ser adicionada.
     */
    adicionaAeronave(aeronave) {
        validate(aeronave, Aeronave)

        this.aeronaves.push(aeronave);
    }

    /**
   * Recupera informações de uma aeronave com base no prefixo.
   * @param {string} prefixo - Prefixo único da aeronave.
   * @returns {Object|null} Informações da aeronave encontrada ou null se não encontrada.
   */
    recuperaAeronavePorPrefixo(prefixo) {
        const aeronaveEncontrada = this.aeronaves.find(aeronave => aeronave.prefixo === prefixo);

        if (aeronaveEncontrada) {
            return {
                prefixo: aeronaveEncontrada.prefixo,
                velocidadeCruzeiro: aeronaveEncontrada.velocidadeCruzeiro,
                autonomia: aeronaveEncontrada.autonomia,
                respManutencao: aeronaveEncontrada.respManutencao != undefined ? aeronaveEncontrada.respManutencao : 'Esse tipo de aeronave não possui essa informação.',
                nomeCIA: aeronaveEncontrada.nomeCIA != undefined ? aeronaveEncontrada.nomeCIA : 'Esse tipo de aeronave não possui essa informação.',
                maxPassageiros: aeronaveEncontrada.maxPassageiros != undefined ? aeronaveEncontrada.maxPassageiros : 'Esse tipo de aeronave não possui essa informação.',
                pesoMax: aeronaveEncontrada.pesoMax != undefined ? aeronaveEncontrada.pesoMax : 'Esse tipo de aeronave não possui essa informação.'
            };
        } else {
            return null;
        }
    }

    /**
    * Lista todas as aeronaves com informações formatadas.
    * @returns {Array<Object>} Lista de informações formatadas das aeronaves.
    */
    listaTodasAsAeronaves() {
        return this.aeronaves.map(aeronave => ({
            prefixo: aeronave.prefixo,
            velociadeCruzeiro: aeronave.velociadeCruzeiro,
            autonomia: aeronave.autonomia,
            respManutencao: aeronave.respManutencao != undefined ? aeronave.respManutencao : 'Esse tipo de aeronave não possui essa informação.',
            nomeCIA: aeronave.nomeCIA != undefined ? aeronave.nomeCIA : 'Esse tipo de aeronave não possui essa informação.',
            maxPassageiros: aeronave.maxPassageiros != undefined ? aeronave.maxPassageiros : 'Esse tipo de aeronave não possui essa informação.',
            pesoMax: aeronave.pesoMax != undefined ? aeronave.pesoMax : 'Esse tipo de aeronave não possui essa informação.'
        }));
    }
}

export const servicoAeronaves = new ServicoAeronave();