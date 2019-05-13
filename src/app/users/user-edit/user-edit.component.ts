import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';

import { IUser } from '../shared/users.model';
import { UsersApiService } from '../shared/users-api.service';

import { Country } from '../shared/country.data';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {

  pageTitle = 'User Edit';
  errorMessage = '';
  userForm: FormGroup;
  user: IUser;
  private sub: Subscription;
  countries = Country;
  dateOfBirth;
  age: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersApiService: UsersApiService
  ) { }

  ngOnInit() {
    this.createUserForm();

    // Read the user Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getUser(id);
      }
    );

    this.userForm.controls.dateOfBirth.valueChanges.subscribe(res => {
      this.calculateAge();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  createUserForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [0],
      email: ['', Validators.email],
      dateOfBirth: [''],
      identityNumber: [null, [Validators.required]],
      address: this.fb.group({
        lineOne: ['', Validators.required],
        lineTwo: [''],
        city: ['', Validators.required],
        country: [''],
        postalCode: ['', Validators.required],
      })
    });
  }

  getUser(id: number): void {
    this.usersApiService.getUser(id)
      .subscribe(
        (user: IUser) => {
          this.displayUser(user);
        },
        (error: any) => this.errorMessage = <any>error
      );
  }

  displayUser(user: IUser): void {
    if (this.userForm) {
      this.userForm.reset();
    }
    this.user = user;

    if (this.user.id === 0) {
      this.pageTitle = 'Add User';
    } else {
      this.pageTitle = 'Edit User:';
    }

    // Update the data on the form
    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      age: this.user.age,
      email: this.user.email,
      dateOfBirth: this.user.dateOfBirth,
      identityNumber: this.user.identityNumber,
      address: {
        lineOne: this.user.address.lineOne,
        lineTwo: this.user.address.lineTwo,
        city: this.user.address.city,
        country: this.user.address.country,
        postalCode: this.user.address.postalCode,
      }
    });

    this.dateOfBirth = new Date(this.userForm.controls.dateOfBirth.value).toISOString().substring(0, 10);
    this.userForm.controls['dateOfBirth'].setValue(this.dateOfBirth);

  }

  saveUser(): void {
    if (this.userForm.valid) {
      if (this.userForm.dirty) {
        const u = { ...this.user, ...this.userForm.value };

        if (u.id === 0) {
          this.usersApiService.createUser(u)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        } else {
          this.usersApiService.updateUser(u)
            .subscribe(
              () => {
                this.onSaveComplete();
              },
              (error: any) => this.errorMessage = <any>error
            );
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  deleteUser(): void {
    if (this.user.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the user: ${this.user.firstName}?`)) {
        this.usersApiService.deleteUser(this.user.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.userForm.reset();
    this.router.navigate(['/user-list']);
  }

  calculateAge(): void {
    if (this.userForm.controls.dateOfBirth.value) {
      const convertedTime = new Date(this.userForm.controls.dateOfBirth.value).toISOString().substring(0, 10)
      const timeDiff = Math.abs(Date.now() - new Date(convertedTime).getTime());
      this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      this.userForm.controls['age'].setValue(this.age);
    }
  }

}
