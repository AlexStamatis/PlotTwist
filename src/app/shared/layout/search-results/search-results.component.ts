import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, isSignal, signal } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Params } from '@angular/router';
import { from, startWith } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule,SpinnerComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
})
export class SearchResultsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tmdbService = inject(TmdbService);

  @Input() results: any[] = [];

  query = signal<Params>({});
  searchResults = signal<any[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  isLoading = signal(false);

  constructor() {
    from(this.route.queryParams)
      .pipe(startWith({} as Params)) //Before emitting any actual queryParams, emit an empty object {} first.
      .subscribe((params) => this.query.set(params));

    effect(() => {
      const q = this.query()?.['query']?.trim() || '';
      const page = this.currentPage();

      if(q) {
       this.loadResults(page === 1);
      } else {
        this.searchResults.set([]);
        this.totalPages.set(1);
      }
    });

    
  }

  loadResults(reset:boolean = false) {
    const q = this.query()?.['query']?.trim() || '';
    const page = this.currentPage();

    if(!q) {
      return;
    }

    this.isLoading.set(true);
    this.tmdbService.multiSearch(q,page).subscribe((res:any) => {
      const filtered = (res.results || []).filter((item:any) => {
        if(item.media_type === 'movie' || item.media_type === 'tv'){
          return !!item.poster_path;
        } else if (item.media_type === 'person') {
          return !!item.profile_path;
        } return false;
      });
      if (reset) {
        this.searchResults.set(filtered);
      } else {
        const current = this.searchResults();
        this.searchResults.set([...current,...filtered])
      }
      this.totalPages.set(res.total_pages);
      this.isLoading.set(false);
    })
  }

  loadMore() {
  if (this.currentPage() < this.totalPages() && !this.isLoading()) {
    this.currentPage.set(this.currentPage() + 1);
    
  }
}

  navigateTo(res: any) {
    switch (res.media_type) {
      case 'movie':
        this.router.navigate(['/movie', res.id]);
        break;

      case 'tv':
        this.router.navigate(['/tv', res.id]);
        break;

      case 'person':
        this.router.navigate(['/person', res.id]);
        break;

      default:
        console.warn('Unknown media type', res.media_type);
    }
  }
}
