import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Client, Page } from '../models';
import { map } from 'rxjs/operators';


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

    listClients(): Observable<Client[]> {
        this.pageSize = 1000;
        return this.getPage().pipe(
            map((page: Page<Client>) => page.docs),
        );
    }

}
