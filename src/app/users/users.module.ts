import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { UsersComponent } from './users.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from '../users/user-edit/user-edit.component';
import { UsersApiService } from '../users/shared/users-api.service';
import { UserDetailComponent } from './user-detail/user-detail.component';


@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'users', component: UsersComponent },
      { path: 'user-list', component: UserListComponent },
      { path: 'user-edit/:id', component: UserEditComponent },
      { path: 'user-detail/:id', component: UserDetailComponent },
    ])
  ],
  declarations: [
    UsersComponent,
    UserListComponent,
    UserEditComponent,
    UserDetailComponent
  ],
  exports: [UserListComponent, UserDetailComponent, RouterModule ],
  providers: [UsersApiService],
})
export class UsersModule { }
