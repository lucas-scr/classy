import { Aluno } from "../../interfaces/aluno";
import { adaptarContratoParaResponse } from "./contrato.adapter";

export function adaptarAlunoParaResponse(data: any): Aluno {
    const contrato = (data.contrato && data.contrato.length > 0) 
    ? data.contrato[0] 
    : null;

    return {
        id: data.id,
        nome: data.nome,
        dataNascimento: data.data_nascimento,
        idade: gerarIdade(data.data_nascimento),
        iniciais: gerarIniciais(data.nome),
        sexo: data.sexo,
        contrato: contrato ? {
            situacao: contrato.situacao,
            nomeResponsavel: contrato.nome_responsavel,
            diasDasAulas: contrato.dias_aulas,
            diasAlternados: contrato.dias_alternados
        } : null
    }
}


export function adaptarAlunoParaRequest(aluno: Aluno): any {
    const request: any = {
        nome: aluno.nome,
        data_nascimento: aluno.dataNascimento,
        sexo: aluno.sexo
    }
    return request
}



function gerarIniciais(nome: string): string {
    if (!nome) return '';
    let partes = nome.trim().split(/\s+/);
    if (partes.length < 2) {
        let inicialApenasUmNome = partes[0][0].toUpperCase();
        return inicialApenasUmNome;
    }
    let inicialPrimeiroNome = partes[0][0].toUpperCase();
    let inicialUltimoNome = partes[partes.length - 1][0].toUpperCase();
    return inicialPrimeiroNome + inicialUltimoNome;
}


function gerarIdade(dataNascimento: Date): number | undefined {

    if (!dataNascimento) return undefined

    return Math.floor(
        (Date.now() - new Date(dataNascimento).getTime()) /
        (1000 * 60 * 60 * 24 * 365)
    );
}