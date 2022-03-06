import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { SortDirection } from '../../@theme/directives/sortable-header.directive';
import { BaseEntity } from '../models/base-entity.model';
import { environment } from '../../../environments/environment.prod';
import { Page } from '../models/page.model';


export abstract class BaseService<T extends BaseEntity> {

  initPage = 0;
  pageSize = 10;
  sortColumn: string;
  searchFilter = '';
  protected path: string;
  protected fullPath: string;
  protected _sortDirection: SortDirection = '';

  constructor(resource: string, protected httpClient: HttpClient) {
    this.fullPath = `${environment.baseEndpoint}/${resource}`;
    this.path = `${environment.baseEndpoint}`;
  }

  reset() {
    this.sortColumn = '';
    this.sortDirection = '';
    this.searchFilter = '';
  }

  get(id: string): Observable<T> {
    return this.httpClient.get<T>(`${this.fullPath}/${id}`);
  }

  list(term?: string): Observable<T[]> {
    let params: HttpParams;
    if( term ) {
      params = new HttpParams().set('filter', term);
    }
    return this.getPage(0, null, null, params).pipe(
      map((page: Page<T>) => page.docs),
    );
  }

  add(item: T): Observable<T> {
    return this.httpClient.post<T>(this.fullPath, item);
  }

  update(item: T): Observable<T> {
    return this.httpClient.put<T>(`${this.fullPath}`, item);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${this.fullPath}?id=${id}`);
  }

  patch(body: any): Observable<any> {
    return this.httpClient.patch(this.fullPath, body);
  }

  getPage(pageNumber?: number, filter?: string, headers?: HttpHeaders, parameters?: HttpParams): Observable<Page<T>> {
    const page = pageNumber ? (pageNumber - 1) : this.initPage;
    const options = {
      params: new HttpParams().set('page', page.toString())
        .set('size', this.pageSize.toString()),
      headers,
    };
    if (filter) {
      options.params = options.params.set('filter', filter);
    }
    if (parameters) {
      parameters.keys().forEach((key: string) => {
        options.params = options.params.set(key, parameters.get(key));
      });
    }
    if (this._sortDirection !== '') {
      options.params = options.params.set('sortorder', `${this._sortDirection.toUpperCase()}`);
      options.params = options.params.set('sortby', `${this.sortColumn}`);
    }
    return this.httpClient.get<Page<T>>(`${this.fullPath}`, options);
  }

  sortDirectionIcon(field: string): string {
    if (this.sortColumn === field) {
      switch (this._sortDirection) {
        case 'asc':
          return 'fa-sort-up';
        case 'desc':
          return 'fa-sort-down';
        default:
          return 'fa-sort';
      }
    } else {
      return 'fa-sort';
    }
  }

  set sortDirection(sortDirection: SortDirection) {
    this._sortDirection = sortDirection;
  }

  get sortDirection() {
    return this._sortDirection;
  }
}