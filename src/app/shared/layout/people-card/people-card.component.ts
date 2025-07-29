import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people-card',
  imports: [],
  templateUrl: './people-card.component.html',
  styleUrl: './people-card.component.css',
})
export class PeopleCardComponent {
  @Input() person!: {
    id:number;
    name: string;
    profile_path: string;
    known_for: {
    title: string;
    name: string;
    popularity: number;
    }[];
  };
  
  constructor(private router:Router) {

  }

  goToPersonDetails(id:number) {
    this.router.navigate(['/person', this.person.id]);
  }

  get mostKnownFor() {
    return this.person.known_for
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);
  }


}
