import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
