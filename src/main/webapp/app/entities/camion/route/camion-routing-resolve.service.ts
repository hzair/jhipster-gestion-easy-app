import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICamion, Camion } from '../camion.model';
import { CamionService } from '../service/camion.service';

@Injectable({ providedIn: 'root' })
export class CamionRoutingResolveService implements Resolve<ICamion> {
  constructor(protected service: CamionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICamion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((camion: HttpResponse<Camion>) => {
          if (camion.body) {
            return of(camion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Camion());
  }
}
