import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IImputation } from '../imputation.model';

@Component({
  selector: 'jhi-imputation-detail',
  templateUrl: './imputation-detail.component.html',
})
export class ImputationDetailComponent implements OnInit {
  imputation: IImputation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ imputation }) => {
      this.imputation = imputation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
