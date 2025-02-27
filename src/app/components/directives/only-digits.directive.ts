import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[onlyDigits]'
})
export class OnlyDigitsDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
  }
}