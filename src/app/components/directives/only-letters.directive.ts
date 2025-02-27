import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[onlyLetters]' 
})
export class OnlyLettersDirective {
  private nameRegex: RegExp = /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ ]*$/; // Allows Polish letters & spaces

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!this.nameRegex.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ ]/g, ''); // Remove invalid characters
    }
  }
}
