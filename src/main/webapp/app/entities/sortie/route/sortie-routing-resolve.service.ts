import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISortie, Sortie } from '../sortie.model';
import { SortieService } from '../service/sortie.service';

@Injectable({ providedIn: 'root' })
export class SortieRoutingResolveService implements Resolve<ISortie> {
  constructor(protected service: SortieService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISortie> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sortie: HttpResponse<Sortie>) => {
          if (sortie.body) {
            return of(sortie.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Sortie());
  }
}
