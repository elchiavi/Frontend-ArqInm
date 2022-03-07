import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Client } from '../models';


@Injectable({
    providedIn: 'root',
})
export class ClientsService extends BaseService<Client> {

    constructor(httpClient: HttpClient) {
        super('clients', httpClient);
    }

    save(isNew: boolean, form: FormGroup): Observable<Client> {
        const client: Client = form.getRawValue();
        return isNew ? this.add(client) : this.update(client);
    }

}