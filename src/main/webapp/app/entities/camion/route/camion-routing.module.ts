import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CamionComponent } from '../list/camion.component';
import { CamionDetailComponent } from '../detail/camion-detail.component';
import { CamionUpdateComponent } from '../update/camion-update.component';
import { CamionRoutingResolveService } from './camion-routing-resolve.service';

const camionRoute: Routes = [
  {
    path: '',
    component: CamionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CamionDetailComponent,
    resolve: {
      camion: CamionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CamionUpdateComponent,
    resolve: {
      camion: CamionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CamionUpdateComponent,
    resolve: {
      camion: CamionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(camionRoute)],
  exports: [RouterModule],
})
export class CamionRoutingModule {}
