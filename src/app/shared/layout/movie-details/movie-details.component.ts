import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { MovieDetails } from '../../models/movie.model';
import { CastCardComponent } from '../cast-card/cast-card.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule,CastCardComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent {
  mediaType = signal<'movie' | 'tv'>('movie');
  id = signal<number | null>(null);
  details = signal<MovieDetails | null>(null);
  crew = signal<any[]>([]);
  cast = signal<any[]>([]);

  genres = computed(() => {
    const value = this.details();
    return value?.genres?.map((g) => g.name).join(', ') || '';
  });

  groupCrewByPerson = computed(() => {
    const grouped = new Map<
      number,
      { id: number; name: string; roles: string[] }
    >();
    const importantJobs = [
      'Director',
      'Screenplay',
      'Writer',
      'Story',
      'Creator',
      'Writing',
      'Directing',
    ];

    for (const person of this.crew()) {
      if (!importantJobs.includes(person.job)) continue;
      const crewMember = grouped.get(person.id);

      if (crewMember) {
        if (!crewMember.roles.includes(person.job)) {
          crewMember.roles.push(person.job);
        }
      } else {
        grouped.set(person.id, {
          id: person.id,
          name: person.name,
          roles: [person.job],
        });
      }
    }
    return Array.from(grouped.values());
  });

  constructor(private route: ActivatedRoute, private tmdbService: TmdbService) {
    const type = this.route.snapshot.routeConfig?.path?.startsWith('tv')
      ? 'tv'
      : 'movie';
    const idParam = this.route.snapshot.paramMap.get('id');

    this.mediaType.set(type);
    this.id.set(idParam ? +idParam : null);

    effect(() => {
      const id = this.id();
      const media = this.mediaType();

      if (id && media) {
        this.tmdbService.getMovieDetails(media, id).subscribe((res) => {
          this.details.set(res);

          let combinedCrew: any[] = [];

          if (media === 'tv' && res.created_by?.length) {
            const creators = res.created_by.map((creator: any) => ({
              ...creator,
              job: 'Creator',
            }));

            combinedCrew = [...combinedCrew, ...creators];
          }

          this.tmdbService.getCredits(media, id).subscribe((res) => {
            if (res.crew?.length) {
              combinedCrew = [...combinedCrew, ...res.crew];
            }
            this.crew.set(combinedCrew);
            if (res.cast?.length) {
              this.cast.set(res.cast);
            }
          });
        });
      }
    });
  }
}
