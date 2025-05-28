import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-people-card',
  imports: [],
  templateUrl: './people-card.component.html',
  styleUrl: './people-card.component.css'
})
export class PeopleCardComponent {
@Input() person!: {
  name: string;
  profile_path: string;
  known_for: {
    title:string;
    name:string;
    popularity:number;
  }[];
}

get mostKnownFor() {
  return this.person.known_for.sort((a,b) => b.popularity - a.popularity).slice(0,3);
}
}
