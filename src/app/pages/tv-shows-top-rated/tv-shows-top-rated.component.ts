import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { FiltersComponent } from "../../shared/layout/filters/filters.component";
import { MovieCardComponent } from "../../shared/layout/movie-card/movie-card.component";

@Component({
  selector: 'app-tv-shows-top-rated',
  standalone:true,
  imports: [FiltersComponent, MovieCardComponent],
  templateUrl: './tv-shows-top-rated.component.html',
  styleUrl: './tv-shows-top-rated.component.css'
})
export class TvShowsTopRatedComponent {
  topRatedTvShows = signal<any[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  constructor(private tmdbService:TmdbService) {
    this.onLoadTvSeries();
  }
onLoadTvSeries() {
  this.tmdbService.getTvShowsTopRated(this.currentPage()).subscribe((res:any) => {
    this.topRatedTvShows.update((series) => [...series,...res.results])
    this.totalPages.set(res.total_pages)
  })
}
onLoadNextPages() {
  if (this.currentPage() < this.totalPages()) {
    this.currentPage.update((page) => page + 1)
    this.onLoadTvSeries()
  }
}
}
