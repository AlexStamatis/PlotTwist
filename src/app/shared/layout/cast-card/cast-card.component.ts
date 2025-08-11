import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cast-card',
  standalone:true,
  imports: [CommonModule,RouterModule],
  templateUrl: './cast-card.component.html',
  styleUrls: ['./cast-card.component.css']
})
export class CastCardComponent {
@Input() castMember!: {
  id:number;
  name:string;
  profile_path:string | null;
  character: string;
  total_episode_count?:number;
}

@Input() showEpisodeCount:boolean = false;

constructor(private router: Router) {}

goToCastDetails(id:number) {
  this.router.navigate(['/person', id]);
}

}
