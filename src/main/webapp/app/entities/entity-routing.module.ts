import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'region',
        data: { pageTitle: 'gestionEasyApp.region.home.title' },
        loadChildren: () => import('./region/region.module').then(m => m.RegionModule),
      },
      {
        path: 'country',
        data: { pageTitle: 'gestionEasyApp.country.home.title' },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'gestionEasyApp.location.home.title' },
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'department',
        data: { pageTitle: 'gestionEasyApp.department.home.title' },
        loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule),
      },
      {
        path: 'task',
        data: { pageTitle: 'gestionEasyApp.task.home.title' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'gestionEasyApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'job',
        data: { pageTitle: 'gestionEasyApp.job.home.title' },
        loadChildren: () => import('./job/job.module').then(m => m.JobModule),
      },
      {
        path: 'job-history',
        data: { pageTitle: 'gestionEasyApp.jobHistory.home.title' },
        loadChildren: () => import('./job-history/job-history.module').then(m => m.JobHistoryModule),
      },
      {
        path: 'produit',
        data: { pageTitle: 'gestionEasyApp.produit.home.title' },
        loadChildren: () => import('./produit/produit.module').then(m => m.ProduitModule),
      },
      {
        path: 'imputation',
        data: { pageTitle: 'gestionEasyApp.imputation.home.title' },
        loadChildren: () => import('./imputation/imputation.module').then(m => m.ImputationModule),
      },
      {
        path: 'employee-2',
        data: { pageTitle: 'gestionEasyApp.employee2.home.title' },
        loadChildren: () => import('./employee-2/employee-2.module').then(m => m.Employee2Module),
      },
      {
        path: 'vendeur',
        data: { pageTitle: 'gestionEasyApp.vendeur.home.title' },
        loadChildren: () => import('./vendeur/vendeur.module').then(m => m.VendeurModule),
      },
      {
        path: 'fournisseur',
        data: { pageTitle: 'gestionEasyApp.fournisseur.home.title' },
        loadChildren: () => import('./fournisseur/fournisseur.module').then(m => m.FournisseurModule),
      },
      {
        path: 'client',
        data: { pageTitle: 'gestionEasyApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'camion',
        data: { pageTitle: 'gestionEasyApp.camion.home.title' },
        loadChildren: () => import('./camion/camion.module').then(m => m.CamionModule),
      },
      {
        path: 'sortie',
        data: { pageTitle: 'gestionEasyApp.sortie.home.title' },
        loadChildren: () => import('./sortie/sortie.module').then(m => m.SortieModule),
      },
      {
        path: 'credit',
        data: { pageTitle: 'gestionEasyApp.credit.home.title' },
        loadChildren: () => import('./credit/credit.module').then(m => m.CreditModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
