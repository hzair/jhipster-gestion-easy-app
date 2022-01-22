import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployee2 } from '../employee-2.model';
import { Employee2Service } from '../service/employee-2.service';
import { Employee2DeleteDialogComponent } from '../delete/employee-2-delete-dialog.component';

@Component({
  selector: 'jhi-employee-2',
  templateUrl: './employee-2.component.html',
})
export class Employee2Component implements OnInit {
  employee2s?: IEmployee2[];
  isLoading = false;

  constructor(protected employee2Service: Employee2Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.employee2Service.query().subscribe({
      next: (res: HttpResponse<IEmployee2[]>) => {
        this.isLoading = false;
        this.employee2s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEmployee2): number {
    return item.id!;
  }

  delete(employee2: IEmployee2): void {
    const modalRef = this.modalService.open(Employee2DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.employee2 = employee2;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
