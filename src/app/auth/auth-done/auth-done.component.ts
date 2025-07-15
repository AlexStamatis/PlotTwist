import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-auth-done',
  standalone: true,
  imports: [],
  templateUrl: './auth-done.component.html',
  styleUrl: './auth-done.component.css'
})
export class AuthDoneComponent {
constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const requestToken = this.route.snapshot.queryParamMap.get('request_token');
    const approved = this.route.snapshot.queryParamMap.get('approved');

    if (requestToken && approved === 'true') {
      this.authService.createSession(requestToken).subscribe({
        next: (res: any) => {
          const sessionId = res.session_id;
          localStorage.setItem('session_id', sessionId);
          console.log('Session created:', sessionId);
        
          this.authService.getAccountDetails(sessionId).subscribe({
            next: (account:any) => {
              localStorage.setItem('username', account.username);
              localStorage.setItem('user_id', account.id);
              this.router.navigate(['/']);
            }
          })
        },
        error: (err) => {
          console.error('Failed to get account details:', err);
          this.router.navigate(['/']);
        }
      });
    } else {
      console.warn('Token not approved or missing');
      this.router.navigate(['/']);
    }
  }
}
