import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISortie, getSortieIdentifier } from '../sortie.model';

export type EntityResponseType = HttpResponse<ISortie>;
export type EntityArrayResponseType = HttpResponse<ISortie[]>;

@Injectable({ providedIn: 'root' })
export class SortieService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sorties');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sortie: ISortie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sortie);
    return this.http
      .post<ISortie>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sortie: ISortie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sortie);
    return this.http
      .put<ISortie>(`${this.resourceUrl}/${getSortieIdentifier(sortie) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(sortie: ISortie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sortie);
    return this.http
      .patch<ISortie>(`${this.resourceUrl}/${getSortieIdentifier(sortie) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISortie>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISortie[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSortieToCollectionIfMissing(sortieCollection: ISortie[], ...sortiesToCheck: (ISortie | null | undefined)[]): ISortie[] {
    const sorties: ISortie[] = sortiesToCheck.filter(isPresent);
    if (sorties.length > 0) {
      const sortieCollectionIdentifiers = sortieCollection.map(sortieItem => getSortieIdentifier(sortieItem)!);
      const sortiesToAdd = sorties.filter(sortieItem => {
        const sortieIdentifier = getSortieIdentifier(sortieItem);
        if (sortieIdentifier == null || sortieCollectionIdentifiers.includes(sortieIdentifier)) {
          return false;
        }
        sortieCollectionIdentifiers.push(sortieIdentifier);
        return true;
      });
      return [...sortiesToAdd, ...sortieCollection];
    }
    return sortieCollection;
  }

  protected convertDateFromClient(sortie: ISortie): ISortie {
    return Object.assign({}, sortie, {
      date: sortie.date?.isValid() ? sortie.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((sortie: ISortie) => {
        sortie.date = sortie.date ? dayjs(sortie.date) : undefined;
      });
    }
    return res;
  }
}
