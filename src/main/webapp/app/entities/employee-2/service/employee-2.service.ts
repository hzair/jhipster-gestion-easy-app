import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmployee2, getEmployee2Identifier } from '../employee-2.model';

export type EntityResponseType = HttpResponse<IEmployee2>;
export type EntityArrayResponseType = HttpResponse<IEmployee2[]>;

@Injectable({ providedIn: 'root' })
export class Employee2Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/employee-2-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(employee2: IEmployee2): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employee2);
    return this.http
      .post<IEmployee2>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(employee2: IEmployee2): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employee2);
    return this.http
      .put<IEmployee2>(`${this.resourceUrl}/${getEmployee2Identifier(employee2) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(employee2: IEmployee2): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employee2);
    return this.http
      .patch<IEmployee2>(`${this.resourceUrl}/${getEmployee2Identifier(employee2) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEmployee2>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEmployee2[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEmployee2ToCollectionIfMissing(
    employee2Collection: IEmployee2[],
    ...employee2sToCheck: (IEmployee2 | null | undefined)[]
  ): IEmployee2[] {
    const employee2s: IEmployee2[] = employee2sToCheck.filter(isPresent);
    if (employee2s.length > 0) {
      const employee2CollectionIdentifiers = employee2Collection.map(employee2Item => getEmployee2Identifier(employee2Item)!);
      const employee2sToAdd = employee2s.filter(employee2Item => {
        const employee2Identifier = getEmployee2Identifier(employee2Item);
        if (employee2Identifier == null || employee2CollectionIdentifiers.includes(employee2Identifier)) {
          return false;
        }
        employee2CollectionIdentifiers.push(employee2Identifier);
        return true;
      });
      return [...employee2sToAdd, ...employee2Collection];
    }
    return employee2Collection;
  }

  protected convertDateFromClient(employee2: IEmployee2): IEmployee2 {
    return Object.assign({}, employee2, {
      hireDate: employee2.hireDate?.isValid() ? employee2.hireDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.hireDate = res.body.hireDate ? dayjs(res.body.hireDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((employee2: IEmployee2) => {
        employee2.hireDate = employee2.hireDate ? dayjs(employee2.hireDate) : undefined;
      });
    }
    return res;
  }
}
