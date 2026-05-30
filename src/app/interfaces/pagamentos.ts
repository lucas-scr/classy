import { Contrato } from "./contrato";

export interface Pagamento {
    id?: number;
    valor: number;
    valorPago?: number;
    dataPagamento: Date;
    dataVencimento: Date;
    contratoId: number;
    contrato?: Contrato;
    situacao: string;
    meioDePagamento: string;
    motivoCancelamento?: string;
}