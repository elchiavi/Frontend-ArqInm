import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Client } from '../models';
import { ClientsService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class ClientResolver implements Resolve<Client> {

  constructor(private clientsService: ClientsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Client> {
    if (route.params['id'] !== 'new') {
      return this.clientsService.get(route.params['id']);
    } else {
      return of(null);
    }
  }
}
