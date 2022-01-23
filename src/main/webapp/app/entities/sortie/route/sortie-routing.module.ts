import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SortieComponent } from '../list/sortie.component';
import { SortieDetailComponent } from '../detail/sortie-detail.component';
import { SortieUpdateComponent } from '../update/sortie-update.component';
import { SortieRoutingResolveService } from './sortie-routing-resolve.service';

const sortieRoute: Routes = [
  {
    path: '',
    component: SortieComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SortieDetailComponent,
    resolve: {
      sortie: SortieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SortieUpdateComponent,
    resolve: {
      sortie: SortieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SortieUpdateComponent,
    resolve: {
      sortie: SortieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sortieRoute)],
  exports: [RouterModule],
})
export class SortieRoutingModule {}
