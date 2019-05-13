import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { IUser } from './users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  private baseUrl = 'http://demo-userapi.azurewebsites.net/api/users';

  constructor(private http: HttpClient) { }

  createUser(user: IUser): Observable<IUser> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<IUser>(this.baseUrl, user, { headers: headers })
      .pipe(
        tap(data => console.log('createuser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getUsers() {
    return this.http.get(this.baseUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }


  getUser(id: number): Observable<IUser> {
    if (id === 0) {
      return of(this.initializeUser());
    }
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IUser>(url)
      .pipe(
        tap(data => console.log('getUser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteUser(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<IUser>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteUser: ' + id)),
        catchError(this.handleError)
      );
  }

  updateUser(user: IUser): Observable<IUser> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.baseUrl}/${user.id}`;
    return this.http.put<IUser>(url, user, { headers: headers })
      .pipe(
        tap(() => console.log('updateUser: ' + user.id)),
        // Return the user on an update
        map(() => user),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  initializeUser(): IUser {
    return {
      id: 0,
      firstName: null,
      lastName: null,
      age: null,
      email: null,
      dateOfBirth: null,
      identityNumber: null,
      address: {
        lineOne: null,
        lineTwo: null,
        city: null,
        country: null,
        postalCode: null
      }
    };
  }
}
