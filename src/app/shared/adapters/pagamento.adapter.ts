import { Pagamento } from "../../interfaces/pagamentos";
import { enumnSituacoesPagamentos } from "../Enums/enumSituacoes";

export function adaptarPagamentoParaRequest(data: Pagamento): any{
 return data
}

export function adaptarPagamentoParaResponse(data: any): Pagamento{
    const pagamento: Pagamento = {
        id: data.id,
        created_at: data.created_at,
        valor_original: data.valor_original,
        vencimento: data.vencimento,
        contrato_id: data.contrato_id,
        descricao: data.descricao,
        desconto: data.desconto,
        valor_total: data.valor_total,
        data_pagamento: data.data_pagamento,
        situacao: enumnSituacoesPagamentos[data.situacao],
        motivoCancelamento: data.motivo_cancelamento,
        responsavel_contrato: data.contrato.nome_responsavel,
        aluno: data.contrato.aluno.nome        
    }
    return pagamento
}