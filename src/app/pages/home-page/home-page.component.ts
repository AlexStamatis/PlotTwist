import { Component } from '@angular/core';
import { ToggleButtonComponent } from '../../shared/layout/toggle-button/toggle-button.component';

export interface ButtonOptions {
  btnName: string;
  isActive: boolean;
}

@Component({
  selector: 'app-home-page',
  standalone:true,
  imports: [ToggleButtonComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  buttonOptions: ButtonOptions[] = [
    {btnName: 'Today', isActive: true},
    {btnName: 'This Week', isActive: false}, 
  ]
}
