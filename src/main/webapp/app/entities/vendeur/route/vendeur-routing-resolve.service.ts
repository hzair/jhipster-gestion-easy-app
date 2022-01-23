import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVendeur, Vendeur } from '../vendeur.model';
import { VendeurService } from '../service/vendeur.service';

@Injectable({ providedIn: 'root' })
export class VendeurRoutingResolveService implements Resolve<IVendeur> {
  constructor(protected service: VendeurService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVendeur> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vendeur: HttpResponse<Vendeur>) => {
          if (vendeur.body) {
            return of(vendeur.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Vendeur());
  }
}
