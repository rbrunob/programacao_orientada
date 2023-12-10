import { validate } from 'bycontract';

/**
 * Representa uma instância da classe Piloto que contém informações sobre um piloto.
 *
 * @class
 * @classdesc Esta classe contém propriedades e métodos relacionados a um piloto.
 */
export class Piloto {
    #nome;
    #matricula;
    #habilitacaoAtiva;

    constructor(nome, habilitacaoAtiva, matricula) {
        validate([nome, habilitacaoAtiva, matricula], ["String", "Number", "String"]);

        this.#nome = nome;
        this.#habilitacaoAtiva = habilitacaoAtiva;
        this.#matricula = matricula;
    }

    // Getters para acessar as informações do piloto
    get matricula() {
        return this.#matricula;
    }

    get nome() {
        return this.#nome;
    }

    get habilitacaoAtiva() {
        return this.#habilitacaoAtiva;
    }
}

/**
 * Representa uma instância da classe ServicoPilotos que gerencia informações sobre pilotos.
 * @class
 */
export class ServicoPilotos {
    pilotos;

    constructor() {
        this.pilotos = [];
    }

    // Método para adicionar um piloto
    adicionaPiloto(piloto) {
        validate(piloto, Piloto);

        this.pilotos.push(piloto)
    }

    // Método para recuperar todas as informações dos pilotos
    recuperaInformacoesPiloto(matricula) {
        validate(matricula, "String");

        const pilotosEncontrados = this.pilotos.filter(piloto => piloto.matricula === matricula);

        return pilotosEncontrados.map(piloto => ({
            nome: piloto.nome,
            habilitacaoAtiva: piloto.habilitacaoAtiva,
            matricula: piloto.matricula
        }));
    }

    // Método para recuperar informações de um piloto por matrícula
    mostrarTodosOsPilotos() {
        return this.pilotos.map(piloto => ({
            nome: piloto.nome,
            habilitacaoAtiva: piloto.habilitacaoAtiva == 1 ? 'Ativa' : 'Inativa',
            matricula: piloto.matricula
        }));
    }
}

export const servicoPiloto = new ServicoPilotos();
