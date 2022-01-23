import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVendeur, getVendeurIdentifier } from '../vendeur.model';

export type EntityResponseType = HttpResponse<IVendeur>;
export type EntityArrayResponseType = HttpResponse<IVendeur[]>;

@Injectable({ providedIn: 'root' })
export class VendeurService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vendeurs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vendeur: IVendeur): Observable<EntityResponseType> {
    return this.http.post<IVendeur>(this.resourceUrl, vendeur, { observe: 'response' });
  }

  update(vendeur: IVendeur): Observable<EntityResponseType> {
    return this.http.put<IVendeur>(`${this.resourceUrl}/${getVendeurIdentifier(vendeur) as number}`, vendeur, { observe: 'response' });
  }

  partialUpdate(vendeur: IVendeur): Observable<EntityResponseType> {
    return this.http.patch<IVendeur>(`${this.resourceUrl}/${getVendeurIdentifier(vendeur) as number}`, vendeur, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVendeur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVendeur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVendeurToCollectionIfMissing(vendeurCollection: IVendeur[], ...vendeursToCheck: (IVendeur | null | undefined)[]): IVendeur[] {
    const vendeurs: IVendeur[] = vendeursToCheck.filter(isPresent);
    if (vendeurs.length > 0) {
      const vendeurCollectionIdentifiers = vendeurCollection.map(vendeurItem => getVendeurIdentifier(vendeurItem)!);
      const vendeursToAdd = vendeurs.filter(vendeurItem => {
        const vendeurIdentifier = getVendeurIdentifier(vendeurItem);
        if (vendeurIdentifier == null || vendeurCollectionIdentifiers.includes(vendeurIdentifier)) {
          return false;
        }
        vendeurCollectionIdentifiers.push(vendeurIdentifier);
        return true;
      });
      return [...vendeursToAdd, ...vendeurCollection];
    }
    return vendeurCollection;
  }
}
