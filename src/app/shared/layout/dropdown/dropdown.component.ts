import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, signal } from "@angular/core";

@Component({
    selector:'app-dropdown',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.css']

})

export class DropdownComponent implements OnChanges {
    @Input() category = '';
    @Input() options: string[] = [];
    @Input() isFirstDropdown: boolean = false;
    @Output() selectionChanged = new EventEmitter();


    selected = signal<string | null>(null);

    onSelect (option:string) {
        this.selected.set(option);
        this.selectionChanged.emit(option);
    }

    ngOnChanges() {
        console.log(this.isFirstDropdown);
    } 
}

