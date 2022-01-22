import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IImputation, getImputationIdentifier } from '../imputation.model';

export type EntityResponseType = HttpResponse<IImputation>;
export type EntityArrayResponseType = HttpResponse<IImputation[]>;

@Injectable({ providedIn: 'root' })
export class ImputationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/imputations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(imputation: IImputation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(imputation);
    return this.http
      .post<IImputation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(imputation: IImputation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(imputation);
    return this.http
      .put<IImputation>(`${this.resourceUrl}/${getImputationIdentifier(imputation) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(imputation: IImputation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(imputation);
    return this.http
      .patch<IImputation>(`${this.resourceUrl}/${getImputationIdentifier(imputation) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IImputation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IImputation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addImputationToCollectionIfMissing(
    imputationCollection: IImputation[],
    ...imputationsToCheck: (IImputation | null | undefined)[]
  ): IImputation[] {
    const imputations: IImputation[] = imputationsToCheck.filter(isPresent);
    if (imputations.length > 0) {
      const imputationCollectionIdentifiers = imputationCollection.map(imputationItem => getImputationIdentifier(imputationItem)!);
      const imputationsToAdd = imputations.filter(imputationItem => {
        const imputationIdentifier = getImputationIdentifier(imputationItem);
        if (imputationIdentifier == null || imputationCollectionIdentifiers.includes(imputationIdentifier)) {
          return false;
        }
        imputationCollectionIdentifiers.push(imputationIdentifier);
        return true;
      });
      return [...imputationsToAdd, ...imputationCollection];
    }
    return imputationCollection;
  }

  protected convertDateFromClient(imputation: IImputation): IImputation {
    return Object.assign({}, imputation, {
      date: imputation.date?.isValid() ? imputation.date.toJSON() : undefined,
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
      res.body.forEach((imputation: IImputation) => {
        imputation.date = imputation.date ? dayjs(imputation.date) : undefined;
      });
    }
    return res;
  }
}
