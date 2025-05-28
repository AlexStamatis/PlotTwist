import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { FiltersComponent } from "../../shared/layout/filters/filters.component";
import { MovieCardComponent } from "../../shared/layout/movie-card/movie-card.component";

@Component({
  selector: 'app-tv-shows-on-tv',
  standalone:true,
  imports: [FiltersComponent, MovieCardComponent],
  templateUrl: './tv-shows-on-tv.component.html',
  styleUrl: './tv-shows-on-tv.component.css'
})
export class TvShowsOnTvComponent {
showsOnTv = signal<any[]>([]);
currentPage = signal<number>(1);
totalPages = signal<number>(1);

constructor(private tmdbService:TmdbService) {
  this.onLoadSeries();
}
onLoadSeries() {
  this.tmdbService.getTvShowsOnTv(this.currentPage()).subscribe((res:any) => {
    this.showsOnTv.update((series) => [...series,...res.results])
    this.totalPages.set(res.total_pages)
  })
}
onLoadNextPages() {
 if (this.currentPage() < this.totalPages()) {
  this.currentPage.update((page) => page + 1)
  this.onLoadSeries()
 }
}
}
