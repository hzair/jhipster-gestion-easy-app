import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICredit, getCreditIdentifier } from '../credit.model';

export type EntityResponseType = HttpResponse<ICredit>;
export type EntityArrayResponseType = HttpResponse<ICredit[]>;

@Injectable({ providedIn: 'root' })
export class CreditService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(credit: ICredit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(credit);
    return this.http
      .post<ICredit>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(credit: ICredit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(credit);
    return this.http
      .put<ICredit>(`${this.resourceUrl}/${getCreditIdentifier(credit) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(credit: ICredit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(credit);
    return this.http
      .patch<ICredit>(`${this.resourceUrl}/${getCreditIdentifier(credit) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICredit>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICredit[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCreditToCollectionIfMissing(creditCollection: ICredit[], ...creditsToCheck: (ICredit | null | undefined)[]): ICredit[] {
    const credits: ICredit[] = creditsToCheck.filter(isPresent);
    if (credits.length > 0) {
      const creditCollectionIdentifiers = creditCollection.map(creditItem => getCreditIdentifier(creditItem)!);
      const creditsToAdd = credits.filter(creditItem => {
        const creditIdentifier = getCreditIdentifier(creditItem);
        if (creditIdentifier == null || creditCollectionIdentifiers.includes(creditIdentifier)) {
          return false;
        }
        creditCollectionIdentifiers.push(creditIdentifier);
        return true;
      });
      return [...creditsToAdd, ...creditCollection];
    }
    return creditCollection;
  }

  protected convertDateFromClient(credit: ICredit): ICredit {
    return Object.assign({}, credit, {
      date: credit.date?.isValid() ? credit.date.toJSON() : undefined,
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
      res.body.forEach((credit: ICredit) => {
        credit.date = credit.date ? dayjs(credit.date) : undefined;
      });
    }
    return res;
  }
}
