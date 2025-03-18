export interface AvailableDate {
    label: string;
    value: Date;
  }
  
  export function mapDatesToObjects(dates: Date[]): AvailableDate[] {
    return dates.map(date => ({
      label: formatDateLabel(date),
      value: date
    }));
  }
  
  function formatDateLabel(date: Date): string {
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  