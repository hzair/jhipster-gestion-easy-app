import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICamion, getCamionIdentifier } from '../camion.model';

export type EntityResponseType = HttpResponse<ICamion>;
export type EntityArrayResponseType = HttpResponse<ICamion[]>;

@Injectable({ providedIn: 'root' })
export class CamionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/camions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(camion: ICamion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(camion);
    return this.http
      .post<ICamion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(camion: ICamion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(camion);
    return this.http
      .put<ICamion>(`${this.resourceUrl}/${getCamionIdentifier(camion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(camion: ICamion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(camion);
    return this.http
      .patch<ICamion>(`${this.resourceUrl}/${getCamionIdentifier(camion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICamion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICamion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCamionToCollectionIfMissing(camionCollection: ICamion[], ...camionsToCheck: (ICamion | null | undefined)[]): ICamion[] {
    const camions: ICamion[] = camionsToCheck.filter(isPresent);
    if (camions.length > 0) {
      const camionCollectionIdentifiers = camionCollection.map(camionItem => getCamionIdentifier(camionItem)!);
      const camionsToAdd = camions.filter(camionItem => {
        const camionIdentifier = getCamionIdentifier(camionItem);
        if (camionIdentifier == null || camionCollectionIdentifiers.includes(camionIdentifier)) {
          return false;
        }
        camionCollectionIdentifiers.push(camionIdentifier);
        return true;
      });
      return [...camionsToAdd, ...camionCollection];
    }
    return camionCollection;
  }

  protected convertDateFromClient(camion: ICamion): ICamion {
    return Object.assign({}, camion, {
      date: camion.date?.isValid() ? camion.date.toJSON() : undefined,
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
      res.body.forEach((camion: ICamion) => {
        camion.date = camion.date ? dayjs(camion.date) : undefined;
      });
    }
    return res;
  }
}
