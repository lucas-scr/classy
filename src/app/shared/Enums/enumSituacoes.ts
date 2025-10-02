export enum Situacoes{
    EM_ANDAMENTO = "Em andamento",
    CANCELADO = "Cancelado",
    PENDENTE_PAGAMENTO = "Pendente de pag.",
    PENDENTE = "Pendente de ass."
}


export const SituacoesTurmaPorId: Record<number, string> = {
  0: "Cancelado",
  1: "Ativo",
  2: "Pendente de pag.",
  3: "Pendente de ass."
};