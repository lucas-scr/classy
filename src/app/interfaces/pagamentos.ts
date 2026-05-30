import { Contrato } from "./contrato";

export interface Pagamento {
    id?: number;
    created_at?: Date;
    valor_original: number;
    vencimento: Date;
    contrato_id: number;
    descricao?: string;
    data_pagamento?: Date;
    situacao?: number;
    valor_total?: number;
    desconto?: number;
    motivoCancelamento?: string;

    
    contrato?: Contrato;
}