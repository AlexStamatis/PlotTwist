import { Component, computed, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.css',
})
export class PersonDetailsComponent {
  person = signal<any>(null);
  knownFor = signal<any[]>([]);
  showFullBio = signal(false);

  allCredits = signal<any[]>([]);
  filteredCredits = signal<any[]>([]);
  selectedMediaType = signal<'all' | 'movie' | 'tv'>('all');
  selectedDepartment = signal<string>('');
  availableDepartments = signal<string[]>([]);

  isLongBiography = computed(() => {
    const bio = this.person()?.biography || '';
    return bio.split(' ').length > 60;
  });

  getGender(code: number) {
    switch (code) {
      case 1:
        return 'Female';
      case 2:
        return 'Male';
      case 3:
        return 'Non-Binary';
      default:
        return 'N/A';
    }
  }

  formatDate(dateString: string, referenceDateString?: string): string {
    if (!dateString) {
      return 'N/A';
    }

    const birthDate = new Date(dateString);
    const referenceDate = referenceDateString
      ? new Date(referenceDateString)
      : new Date();

    const age = referenceDate.getFullYear() - birthDate.getFullYear();

    const formattedDate = birthDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `${formattedDate} (${age} years old)`;
  }

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
  ) {}

  effect = effect(() => {
    //automatically re-runs filterCredits() any time selectedMediaType() or selectedDepartment() changes, because those signals are read inside filterCredits()
    this.filterCredits();
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.tmdbService.getPersonDetails(id).subscribe((data) => {
      this.person.set(data);
    });

    this.tmdbService.getPersonCredits(id).subscribe((res) => {
      const excludeGenres = [10767, 10763, 10764, 10762, 99, 10766, 10770];

      const merged = [
        ...res.cast.map((item: string[]) => ({
          ...item,
          department: 'Acting',
        })),
        ...res.crew,
      ].filter((item) => {
        const hasPoster = !!item.poster_path;
        const validMedia = ['movie', 'tv'].includes(item.media_type);
        const hasExcludedGenre = item.genre_ids?.some((id: number) =>
          excludeGenres.includes(id)
        );

        return hasPoster && validMedia && !hasExcludedGenre;
      });

      const uniqueById = new Map<number, any>();
      for (const item of merged) {
        if (!uniqueById.has(item.id)) {
          uniqueById.set(item.id, item);
        }
      }

      const noDuplicates = Array.from(uniqueById.values());
      const sorted = noDuplicates.sort((a, b) => {
        const scoreA =
          (a.vote_average ?? 0) * Math.log((a.vote_count ?? 0) + 1);
        const scoreB =
          (b.vote_average ?? 0) * Math.log((b.vote_count ?? 0) + 1);
        return scoreB - scoreA;
      });

      this.knownFor.set(sorted.slice(0, 8));
      this.allCredits.set(sorted);
      this.filterCredits();

      const departmentList = new Set<string>();
      for (const item of sorted) {
        const dep = item.department || item.known_for_department;
        if (dep) {
          departmentList.add(dep);
        }
      }
      this.availableDepartments.set(Array.from(departmentList).sort());
    });
  }
  toggleBiography() {
    this.showFullBio.update((v) => !v);
  }

  filterCredits() {
    const mediaType = this.selectedMediaType();
    const department = this.selectedDepartment();

    const birthday = this.person()?.birthday
      ? new Date(this.person().birthday)
      : null;

    let result = this.allCredits();

    if (mediaType !== 'all') {
      result = result.filter((item) => item.media_type === mediaType);
    }

    if (department !== '') {
      result = result.filter(
        (item) =>
          item.department === department ||
          item.known_for_department === department
      );
    }
    result = result
      .filter((item) => {
        const rawDate = item.release_date || item.first_air_date;
        if (!rawDate) return false;

        const releaseDate = new Date(rawDate);
        if (isNaN(releaseDate.getTime())) return false;
        if (birthday && releaseDate < birthday) return false;
        return true;
      })
      .sort((a, b) => {
        const getDate = (item: any) => {
          const rawDate = item.release_date || item.first_air_date;
          const timestamp = Date.parse(rawDate);
          return isNaN(timestamp) ? 0 : timestamp;
        };
        return getDate(b) - getDate(a);
      });

    this.filteredCredits.set(result);
  }

  clearFilters() {
    this.selectedMediaType.set('all');
    this.selectedDepartment.set('');
    this.filteredCredits.set(this.allCredits());
  }
}
