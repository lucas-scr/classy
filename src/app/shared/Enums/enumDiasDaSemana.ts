export enum DiasDaSemana {
  DOMINGO = 'DOMINGO',
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA',
  SABADO = 'SABADO'
}

// Mapeamento dos nomes amigáveis
export const DiasDaSemanaDescricao: Record<DiasDaSemana, string> = {
  [DiasDaSemana.DOMINGO]: 'Domingo',
  [DiasDaSemana.SEGUNDA]: 'Segunda-feira',
  [DiasDaSemana.TERCA]: 'Terça-feira',
  [DiasDaSemana.QUARTA]: 'Quarta-feira',
  [DiasDaSemana.QUINTA]: 'Quinta-feira',
  [DiasDaSemana.SEXTA]: 'Sexta-feira',
  [DiasDaSemana.SABADO]: 'Sábado'
};