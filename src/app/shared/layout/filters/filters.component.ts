import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  @Input() filterTitle = '';
  sortSelected = signal<string | null>(null);
  @Output() searchBtnClicked = new EventEmitter<string>();

  constructor(private tmdbService:TmdbService){}

  onSortSelected(sort: string) {
    this.sortSelected.set(sort);
  }

  onSearch() {
   if (this.sortSelected()) {
    this.searchBtnClicked.emit(this.sortSelected()!)
   }
    
  
  }
}
