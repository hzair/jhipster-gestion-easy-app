import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICamion } from '../camion.model';
import { CamionService } from '../service/camion.service';
import { CamionDeleteDialogComponent } from '../delete/camion-delete-dialog.component';

@Component({
  selector: 'jhi-camion',
  templateUrl: './camion.component.html',
})
export class CamionComponent implements OnInit {
  camions?: ICamion[];
  isLoading = false;

  constructor(protected camionService: CamionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.camionService.query().subscribe({
      next: (res: HttpResponse<ICamion[]>) => {
        this.isLoading = false;
        this.camions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICamion): number {
    return item.id!;
  }

  delete(camion: ICamion): void {
    const modalRef = this.modalService.open(CamionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.camion = camion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
