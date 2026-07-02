import { Component, input } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly brandName = input('WaslX');
  readonly footerLabel = input('Layout foundation ready');
  readonly year = new Date().getFullYear();
}
