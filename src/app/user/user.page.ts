import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, filter, first, switchMap } from 'rxjs';
import { EditComponent } from '../common/components/edit.abstract.component';
import { DEFAULT_DEBOUNCE, activityLevels } from '../common/constants';
import { User } from '../common/interfaces/user.interface';
import { UserService } from './user.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage extends EditComponent<
  User,
  'uid' | 'created' | 'modified' | 'email'
> {
  activityLevels = activityLevels;
  tdee: number | undefined;

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,
    protected override route: ActivatedRoute
  ) {
    super(route, userService);
  }

  override ionViewWillEnter() {
    let userUid: string;

    this.auth.user
      .pipe(
        filter(Boolean),
        first(),
        switchMap(({ uid }) => {
          userUid = uid;
          return this.userService.get(uid);
        }),
        switchMap((user) => {
          this.entity = user;

          this.form = new FormGroup({
            avatar: new FormControl(this.entity?.avatar),
            userName: new FormControl(this.entity?.userName),
          });

          return this.form.valueChanges;
        }),
        debounceTime(DEFAULT_DEBOUNCE),

        switchMap((value) => this.userService.save(userUid, value))
      )
      .subscribe();
  }
}
