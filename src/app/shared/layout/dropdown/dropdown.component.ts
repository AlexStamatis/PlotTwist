import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, signal } from "@angular/core";

@Component({
    selector:'app-dropdown',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dropdown.component.html'

})

export class DropdownComponent {
    @Input() category = '';
    @Input() options: string[] = [];
    @Output() selectionChanged = new EventEmitter();

    selected = signal<string | null>(null);

    onSelect (option:string) {
        this.selected.set(option);
        this.selectionChanged.emit(option);
    }
}

