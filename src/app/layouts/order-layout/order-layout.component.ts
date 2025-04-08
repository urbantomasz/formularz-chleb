import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-order-layout',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './order-layout.component.html',
  styleUrl: './order-layout.component.css'
})
export class OrderLayoutComponent {

}
