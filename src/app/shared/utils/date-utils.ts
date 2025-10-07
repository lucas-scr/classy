export class DateUtils {
  
  /**
   * Avança ou retrocede uma data em dias, horas, minutos ou meses.
   * 
   * @param date Data base
   * @param amount Valor a somar (positivo) ou subtrair (negativo)
   * @param unit Unidade de tempo ('days', 'hours', 'minutes', 'months')
   * @returns Nova data ajustada
   */
  static adjustDate(date: Date, amount: number, unit: 'days' | 'hours' | 'minutes' | 'months'): Date {
    const newDate = new Date(date); // cria cópia para não mutar a original

    switch (unit) {
      case 'days':
        newDate.setDate(newDate.getDate() + amount);
        break;
      case 'hours':
        newDate.setHours(newDate.getHours() + amount);
        break;
      case 'minutes':
        newDate.setMinutes(newDate.getMinutes() + amount);
        break;
      case 'months':
        newDate.setMonth(newDate.getMonth() + amount);
        break;
    }

    return newDate;
  }

  /**
   * Retorna a diferença entre duas datas em minutos, horas ou dias.
   */
  static diff(date1: Date, date2: Date, unit: 'minutes' | 'hours' | 'days'): number {
    const diffMs = date2.getTime() - date1.getTime();
    switch (unit) {
      case 'minutes': return diffMs / (1000 * 60);
      case 'hours':   return diffMs / (1000 * 60 * 60);
      case 'days':    return diffMs / (1000 * 60 * 60 * 24);
    }
  }
}