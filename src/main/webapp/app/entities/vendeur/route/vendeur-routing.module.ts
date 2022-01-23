import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VendeurComponent } from '../list/vendeur.component';
import { VendeurDetailComponent } from '../detail/vendeur-detail.component';
import { VendeurUpdateComponent } from '../update/vendeur-update.component';
import { VendeurRoutingResolveService } from './vendeur-routing-resolve.service';

const vendeurRoute: Routes = [
  {
    path: '',
    component: VendeurComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VendeurDetailComponent,
    resolve: {
      vendeur: VendeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VendeurUpdateComponent,
    resolve: {
      vendeur: VendeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VendeurUpdateComponent,
    resolve: {
      vendeur: VendeurRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(vendeurRoute)],
  exports: [RouterModule],
})
export class VendeurRoutingModule {}
