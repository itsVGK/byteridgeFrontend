import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public clientIp: String;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string, clientIp = this.clientIp, loginTime = Date.now(), logoutTime = null) {

        return this.http.post<any>(`${config.apiUrl}/users/authenticate`, { username, password, clientIp, loginTime, logoutTime })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout(logoutTime = Date.now()) {
        // remove user from local storage to log user out
        let username = JSON.parse(localStorage.getItem('currentUser')).username;
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        if (username)
            return this.http.post<any>(`${config.apiUrl}/users/authenticate`, { username, logoutTime });

    }

    getIpAddress() {
        this.http.get(`http://api.ipify.org/?format=json`).subscribe((ip: any) => {
            this.clientIp = ip.ip;
        })
    }
}