import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { MovieCardComponent } from "../../shared/layout/movie-card/movie-card.component";
import { FiltersComponent } from "../../shared/layout/filters/filters.component";

@Component({
  selector: 'app-tv-shows-popular',
  standalone:true,
  imports: [MovieCardComponent, FiltersComponent],
  templateUrl: './tv-shows-popular.component.html',
  styleUrl: './tv-shows-popular.component.css'
})
export class TvShowsPopularComponent {

  popularTvShows = signal<any[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  constructor(private tmdbService: TmdbService) {
    this.onLoadSeries();
  }
  onLoadSeries() {
    this.tmdbService.getPopularTvShows(this.currentPage()).subscribe((res:any) => {
      this.popularTvShows.update((series) => [...series,...res.results])
      this.totalPages.set(res.total_pages)
    })
  }
  onLoadNextPages() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page +1);
      this.onLoadSeries();
    }
  }
}
