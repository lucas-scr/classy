import { Pessoa } from "../interfaces/pessoa";

export class Responsavel implements Pessoa{
    nome: String;
    documento: String;
    contato: Number;

    constructor(nome: String, documento: String, contato: Number){
        this.nome = nome;
        this.documento = documento;
        this.contato = contato
    }

    get getNome(): String {
        return this.nome;
    }

    set setNome(valor: String) {
        if (!valor.trim()) throw new Error("Nome não pode ser vazio!");
        this.nome = valor;
    }


}