import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IImputation } from '../imputation.model';
import { ImputationService } from '../service/imputation.service';
import { ImputationDeleteDialogComponent } from '../delete/imputation-delete-dialog.component';

@Component({
  selector: 'jhi-imputation',
  templateUrl: './imputation.component.html',
})
export class ImputationComponent implements OnInit {
  imputations?: IImputation[];
  isLoading = false;

  constructor(protected imputationService: ImputationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.imputationService.query().subscribe({
      next: (res: HttpResponse<IImputation[]>) => {
        this.isLoading = false;
        this.imputations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IImputation): string {
    return item.id!;
  }

  delete(imputation: IImputation): void {
    const modalRef = this.modalService.open(ImputationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.imputation = imputation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
