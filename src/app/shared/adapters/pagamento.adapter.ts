import { Pagamento } from "../../interfaces/pagamentos";
import { Turma } from "../../interfaces/turma";

export function adaptarPagamentoParaRequest(data: Pagamento): any{

}

export function adaptarPagamentoParaResponse(data: any): Pagamento{
    const pagamento: Pagamento = {
    valor: 10,
    dataPagamento: new Date(),
    dataVencimento: new Date(),
    contratoId: 1,
    situacao: "pendente",
    meioDePagamento: 'cartao',
    }

    return pagamento
}