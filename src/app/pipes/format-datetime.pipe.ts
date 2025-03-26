import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateTime',
  standalone: true
})
export class FormatDateTimePipe implements PipeTransform {
  transform(value: Date | string, 
            locale: string = 'pl-PL', 
            timeZone: string = 'Europe/Warsaw',  // Defaulting to Warsaw, Poland time zone
            formatOptions: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    
    // Include timeZone in the formatting options
    return date.toLocaleDateString(locale, { ...formatOptions, timeZone });
  }
}
