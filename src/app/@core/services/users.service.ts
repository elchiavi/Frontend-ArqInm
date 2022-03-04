import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';


@Injectable({
    providedIn: 'root',
})
export class UsersService extends BaseService<User> {

    constructor(httpClient: HttpClient) {
        super('users', httpClient);
    }

    enabledUser(user: User): Observable<User> {
        return this.httpClient.put(`${this.fullPath}/enableUser/${user.id}`, {}).pipe(
            map(() => {
                user.enabled = !user.enabled;
                return user;
            }),
        );
    }

    save(isNew: boolean, form: FormGroup): Observable<User> {
        const user: User = form.getRawValue();
        return isNew ? this.add(user) : this.update(user);
    }

    resetPass(email: string) {
        return this.httpClient.patch(`${this.fullPath}/resetPassword`, { email });
    }

}