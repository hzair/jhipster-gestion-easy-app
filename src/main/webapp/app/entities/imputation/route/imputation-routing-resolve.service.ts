import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IImputation, Imputation } from '../imputation.model';
import { ImputationService } from '../service/imputation.service';

@Injectable({ providedIn: 'root' })
export class ImputationRoutingResolveService implements Resolve<IImputation> {
  constructor(protected service: ImputationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IImputation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((imputation: HttpResponse<Imputation>) => {
          if (imputation.body) {
            return of(imputation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Imputation());
  }
}
