import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true 
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date | string, locale: string = 'pl-PL', formatOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    
    return date.toLocaleDateString(locale, formatOptions);
  }
}
