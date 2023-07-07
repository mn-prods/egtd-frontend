import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPageRoutingModule } from './user-routing.module';

import { UserPage } from './user.page';
import { AppCommonModule } from '../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    FormsModule,
    IonicModule,
    UserPageRoutingModule,
  ],
  declarations: [UserPage],
})
export class UserPageModule {}
