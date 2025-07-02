import { Aula } from "../interfaces/aula";
import { Pessoa } from "../interfaces/pessoa";


 export class Aluno implements Pessoa {
    id: Number;
    nome: String;
    idade?: Number;
    dataNascimento: Date;
    dias: Aula[];
    autorizacaoDeImagem: boolean;
    iniciaisNome: String;
    sexo: String;
    isDiasAlternados: boolean;

    constructor(nome: String, dataNascimento: Date, sexo: String ,autorizacaoDeImagem: boolean, diasAlternados: boolean, diasDaSemana?: Aula[], id?: Number, iniciais?: String){
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.autorizacaoDeImagem = autorizacaoDeImagem;
        this.iniciaisNome = this.gerarIniciais(nome);
        this.sexo = sexo;
        this.dias = diasDaSemana;
        this.id = id;
        this.idade = this.calcularIdade(dataNascimento);
        this.isDiasAlternados = diasAlternados;
    }



    gerarIniciais(nome: String):String{
        let partes = nome.trim().split(/\s+/);
        if (partes.length < 2) {
            let inicialApenasUmNome = partes[0][0].toUpperCase();
            return inicialApenasUmNome;
        }
        let inicialPrimeiroNome = partes[0][0].toUpperCase();
        let inicialUltimoNome = partes [partes.length -1][0].toUpperCase();
        return  inicialPrimeiroNome + inicialUltimoNome;
    }

    calcularIdade(dataNascimento: Date): Number{
        const data = new Date();
        let idade = data.getFullYear() - dataNascimento.getFullYear();
        const mesAtual = data.getMonth();
        const mesNascimento = dataNascimento.getMonth();

        if(mesAtual < mesNascimento || (mesAtual === mesNascimento && data.getDate() < data.getDate())){
            idade--;
        }
        return idade;
    }


}