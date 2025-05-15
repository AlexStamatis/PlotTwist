import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonOptions } from '../../../pages/home-page/home-page.component';

@Component({
  selector: 'app-toggle-button',
  imports: [CommonModule],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css'
})
export class ToggleButtonComponent {
@Input() options: ButtonOptions[] = [];
@Output() optionChanged = new EventEmitter();

selectedOption = signal<string | null>('')


onBtnClick(option: ButtonOptions) {}

onBtnFocus(selectedItem: ButtonOptions) {
  this.options.forEach(item => {
    if (selectedItem.btnName === item.btnName) {
       item.isActive = true
    } else {
       item.isActive = false
    }
   
  })
}
}
