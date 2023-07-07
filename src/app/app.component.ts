import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { filter, Observable, switchMap } from 'rxjs';
import { FirebaseUser } from './common/interfaces/user.interface';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private auth: AngularFireAuth,
    private userService: UserService
  ) {}

  get user$(): Observable<FirebaseUser | null> {
    return this.auth.user;
  }

  ngOnInit(): void {
    this.user$
      .pipe(
        filter(Boolean),
        switchMap((user) => this.userService.save(user.uid, null))
      )
      .subscribe();
  }
}
