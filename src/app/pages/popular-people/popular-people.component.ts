import { Component, signal } from '@angular/core';
import { TmdbService } from '../../shared/services/tmdb.service';
import { PeopleCardComponent } from "../../shared/layout/people-card/people-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popular-people',
  standalone:true,
  imports: [CommonModule,PeopleCardComponent],
  templateUrl: './popular-people.component.html',
  styleUrl: './popular-people.component.css'
})
export class PopularPeopleComponent {
  popularPeople = signal<any[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  constructor(private tmdbService:TmdbService) {
    this.onLoadPopularPeople();
  }
  onLoadPopularPeople() {
    this.tmdbService.getPopularPeople(this.currentPage()).subscribe((res:any) => {
      this.popularPeople.update((people) => [...people,...res.results])
      this.totalPages.set(res.total_pages)
    })
  }

  onLoadNextPages() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1)
    }
    this.onLoadPopularPeople();
  }
}
