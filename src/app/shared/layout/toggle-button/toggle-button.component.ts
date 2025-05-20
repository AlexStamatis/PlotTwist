import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonOptions } from '../../../pages/home-page/home-page.component';

@Component({
  selector: 'app-toggle-button',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css'
})
export class ToggleButtonComponent {
@Input() options: ButtonOptions[] = [];
@Output() optionChanged = new EventEmitter();

selectedOption = signal<string | null>('')


onBtnClick(option: ButtonOptions) {
  this.options.forEach(item => item.isActive = false);   //reseting all buttons to inactive
  option.isActive = true;  //set the clicked button as active
  this.selectedOption.set(option.btnName);
  this.optionChanged.emit(option.btnName);
}

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



// export class ToggleComponent {
//   options = ['Today', 'This Week'];

//   selected = signal<string>('Today'); // Default to 'Today'

//   select(option: string) {
//     this.selected.set(option);
//   }

//   isSelected(option: string): boolean {
//     return this.selected() === option;
//   }
// }
