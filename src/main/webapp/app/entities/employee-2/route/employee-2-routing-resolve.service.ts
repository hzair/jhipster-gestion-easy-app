import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmployee2, Employee2 } from '../employee-2.model';
import { Employee2Service } from '../service/employee-2.service';

@Injectable({ providedIn: 'root' })
export class Employee2RoutingResolveService implements Resolve<IEmployee2> {
  constructor(protected service: Employee2Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmployee2> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((employee2: HttpResponse<Employee2>) => {
          if (employee2.body) {
            return of(employee2.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Employee2());
  }
}
