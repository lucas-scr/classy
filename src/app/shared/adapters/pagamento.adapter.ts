import { Pagamento } from "../../interfaces/pagamentos";

export function adaptarPagamentoParaRequest(data: Pagamento): any{
 return data
}

export function adaptarPagamentoParaResponse(data: any): Pagamento{
    const pagamento: Pagamento = data
    return pagamento
}