import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TmdbService } from '../../services/tmdb.service';
import { CombinedFiltersSelection } from '../../models/movie.model';

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
  genreSelected = signal<Set<number>>(new Set());
  UnselectedSort = signal<string | null>(null);
  UnselectedGenre = signal<number | null>(null);
  @Output() genreSelectedEvent = new EventEmitter<number>();
  @Output() searchBtnClicked = new EventEmitter<CombinedFiltersSelection>();
  @Input() resetOption: number = 0;
  searchTriggered = false;

  sortOptions: { label: string; value: string }[] = [];
  genres: { id: number; name: string }[] = [];

  constructor(private tmdbService: TmdbService) {}

  ngOnInit() {
    this.sortOptions =
      this.contentType === 'tv'
        ? [
            { label: 'Popularity Descending', value: 'popularity.desc' },
            { label: 'Popularity Ascending', value: 'popularity.asc' },
            {
              label: 'First Air Date Descending',
              value: 'first_air_date.desc',
            },
            { label: 'First Air Date Ascending', value: 'first_air_date.asc' },
            { label: 'Rating Descending', value: 'vote_average.desc' },
            { label: 'Rating Ascending', value: 'vote_average.asc' },
          ]
        : [
            { label: 'Popularity Descending', value: 'popularity.desc' },
            { label: 'Popularity Ascending', value: 'popularity.asc' },
            {
              label: 'Release Date Descending',
              value: 'primary_release_date.desc',
            },
            {
              label: 'Release Date Ascending',
              value: 'primary_release_date.asc',
            },
            { label: 'Rating Descending', value: 'vote_average.desc' },
            { label: 'Rating Ascending', value: 'vote_average.asc' },
          ];

    const fetchGenre =
      this.contentType === 'tv'
        ? this.tmdbService.getTvGenres()
        : this.tmdbService.getMovieGenres();
    fetchGenre.subscribe((res) => {
      this.genres = res.genres;
    });
  }

  onSortSelected(sort: string) {
    if (this.sortSelected() === sort) {
      this.sortSelected.set(null);
      this.UnselectedSort.set(sort);
    } else {
      this.sortSelected.set(sort);
      this.UnselectedSort.set(null);
    }
    this.searchTriggered = false;
  }

  onGenreSelected(genreId: number) {
  const selected = new Set(this.genreSelected());
  if (selected.has(genreId)) {
    selected.delete(genreId)
  } else {
    selected.add(genreId);
  }
  this.genreSelected.set(selected);
  this.searchTriggered = false;
  }

  onSearch() {
    const sort = this.sortSelected();
    const genreIds = Array.from(this.genreSelected());
    this.searchTriggered = true;

    this.searchBtnClicked.emit({
      sort: sort ?? undefined,
      genreIds: genreIds.length > 0 ? genreIds : [],
    });
  }

  ngOnChanges() {
    this.sortSelected.set(null);
    this.genreSelected.set(new Set());
  }
}
