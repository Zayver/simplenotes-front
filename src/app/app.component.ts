import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Toast } from 'primeng/toast'
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, HeaderComponent, FooterComponent],
  template: `
    <p-toast class="absolute"/>
    <app-header/>
    <router-outlet class="hidden"/>
    <app-footer/>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
