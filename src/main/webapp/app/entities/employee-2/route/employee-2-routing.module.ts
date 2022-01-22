import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Employee2Component } from '../list/employee-2.component';
import { Employee2DetailComponent } from '../detail/employee-2-detail.component';
import { Employee2UpdateComponent } from '../update/employee-2-update.component';
import { Employee2RoutingResolveService } from './employee-2-routing-resolve.service';

const employee2Route: Routes = [
  {
    path: '',
    component: Employee2Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Employee2DetailComponent,
    resolve: {
      employee2: Employee2RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Employee2UpdateComponent,
    resolve: {
      employee2: Employee2RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Employee2UpdateComponent,
    resolve: {
      employee2: Employee2RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(employee2Route)],
  exports: [RouterModule],
})
export class Employee2RoutingModule {}
