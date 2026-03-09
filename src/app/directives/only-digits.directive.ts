import { Directive, HostListener, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appOnlyDigits]'
})
export class OnlyDigitsDirective {
  
  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
  }
}