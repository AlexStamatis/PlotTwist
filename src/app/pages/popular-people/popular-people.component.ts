import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { PeopleCardComponent } from "../../shared/layout/people-card/people-card.component";
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from "../../shared/layout/spinner/spinner.component";

@Component({
  selector: 'app-popular-people',
  standalone:true,
  imports: [CommonModule, PeopleCardComponent, SpinnerComponent],
  templateUrl: './popular-people.component.html',
  styleUrl: './popular-people.component.css'
})
export class PopularPeopleComponent {
  popularPeople = signal<any[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  loading = signal(true);

  constructor(private tmdbService:TmdbService) {
    this.onLoadPopularPeople();
  }
  onLoadPopularPeople() {
    this.loading.set(true);
    this.tmdbService.getPopularPeople(this.currentPage()).subscribe((res:any) => {
      this.popularPeople.update((people) => [...people,...res.results])
      this.totalPages.set(res.total_pages);
      this.loading.set(false);
    })
    
  }

  onLoadNextPages() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1)
    }
    this.onLoadPopularPeople();
  }
}
