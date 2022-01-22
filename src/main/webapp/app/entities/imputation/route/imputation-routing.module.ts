import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ImputationComponent } from '../list/imputation.component';
import { ImputationDetailComponent } from '../detail/imputation-detail.component';
import { ImputationUpdateComponent } from '../update/imputation-update.component';
import { ImputationRoutingResolveService } from './imputation-routing-resolve.service';

const imputationRoute: Routes = [
  {
    path: '',
    component: ImputationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ImputationDetailComponent,
    resolve: {
      imputation: ImputationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ImputationUpdateComponent,
    resolve: {
      imputation: ImputationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ImputationUpdateComponent,
    resolve: {
      imputation: ImputationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(imputationRoute)],
  exports: [RouterModule],
})
export class ImputationRoutingModule {}
