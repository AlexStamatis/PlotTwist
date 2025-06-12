import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, NgbAccordionModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent implements OnChanges, OnInit {
  @Input() filterTitle = '';
  @Input() contentType: 'movie' | 'tv' = 'movie';
  sortSelected = signal<string | null>(null);
  @Output() searchBtnClicked = new EventEmitter<string>();
  @Input() resetOption:number = 0;

sortOptions: {label: string, value: string}[] = [];

  constructor(private tmdbService:TmdbService){}

  ngOnInit() {
  
    if (this.contentType === 'tv') {
      this.sortOptions = [
        { label: 'Popularity Descending', value: 'popularity.desc' },
        { label: 'Popularity Ascending', value: 'popularity.asc' },
        { label: 'First Air Date Descending', value: 'first_air_date.desc' },
        { label: 'First Air Date Ascending', value: 'first_air_date.asc' },
        { label: 'Rating Descending', value: 'vote_average.desc' },
        { label: 'Rating Ascending', value: 'vote_average.asc' },
      ];
    } else {
      this.sortOptions = [
        { label: 'Popularity Descending', value: 'popularity.desc' },
        { label: 'Popularity Ascending', value: 'popularity.asc' },
        { label: 'Release Date Descending', value: 'primary_release_date.desc' },
        { label: 'Release Date Ascending', value: 'primary_release_date.asc' },
        { label: 'Rating Descending', value: 'vote_average.desc' },
        { label: 'Rating Ascending', value: 'vote_average.asc' },
      ];
    }}

  onSortSelected(sort: string) {
    this.sortSelected.set(sort);
  }

  onSearch() {
   const selected = this.sortSelected();
  if (!selected) return;
  this.searchBtnClicked.emit(selected);
   }

   ngOnChanges() {
    this.sortSelected.set(null);
  }
}
