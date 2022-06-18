import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiProject, Page, Project } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { MultiProjectsService } from '../../../@core/services';
import { Action, ToastService } from '../../../@theme/utils/toast.service';
import { SortEvent, NgxSortableHeaderDirective, Sortable } from '../../../@theme/directives/sortable-header.directive';
import { ModalConfirmComponent } from '../../../@theme/components';

@Component({
    selector: 'ngx-multi-project-list',
    templateUrl: './multi-project-list.component.html',
    styleUrls: ['./multi-project-list.component.scss'],
})
@UnsubscribeOnDestroy()
export class MultiProjectListComponent implements OnInit, OnDestroy, Sortable {

    @ViewChildren(NgxSortableHeaderDirective) headers: QueryList<NgxSortableHeaderDirective>;
    multiProjectPage: Page<MultiProject>;
    new = false;

    constructor(public toastService: ToastService,
        public multiProjectsService: MultiProjectsService,
        public formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public dialogService: NbDialogService) { }

    ngOnInit() {
        this.pageChange();
    }

    pageChange(pageNumber?: number, filter?: string) {
        this.multiProjectsService.getPage(pageNumber, filter).pipe(
            untilComponentDestroy.apply(this)).subscribe((multiProjectPage: Page<MultiProject>) => {
                this.multiProjectPage = multiProjectPage;
            });
    }

    search(filter: string) {
        if (filter.length === 0) {
            this.pageChange();
            return;
        } else if (filter.trim().length === 0) {
            return;
        } else if (filter.trim().length > 2) {
            this.pageChange(null, filter);
        }
    }

    onSort({ column, direction }: SortEvent): void {
        this.headers.forEach(header => {
            if (header.ngxSortable !== column) {
                header.direction = '';
            }
        });
        this.multiProjectsService.sortColumn = column;
        this.multiProjectsService.sortDirection = direction;
        this.pageChange();
    }

    clear(inputSearch: any) {
        if (inputSearch.value !== '') {
            inputSearch.value = '';
            this.pageChange();
        }
    }

    cloneProject(project: Project) {
        // const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
        // const description = `Se clonará el Proyecto de Obra "${project.name}"
        // y se generará un proyecto de Construcción de Obra`;
        // modalRef.componentRef.instance.title = 'Confirmación';
        // modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
        // modalRef.onClose.subscribe((userResponse) => {
        //     if (userResponse) {
        //         this.projectsService.cloneProject(project).pipe(
        //             untilComponentDestroy.apply(this)).subscribe(() => {
        //                 const action: Action = this.new ? 'create' : 'update';
        //                 this.toastService.showToast('El proyecto', action, 'success');
        //                 this.pageChange();
        //             }, () => {
        //                 this.toastService.error('Error inesperado, contactar a su administrador.');
        //             });
        //     }
        // });
    }

    closeProject(project: Project) {
        // const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
        // const description = `Se finalizará la Obra "${project.name}"`;
        // modalRef.componentRef.instance.title = 'Confirmación';
        // modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
        // modalRef.onClose.subscribe((userResponse) => {
        //     if (userResponse) {
        //         project.state = 'Finalizado';
        //         project.client = project.client._id;
        //         this.projectsService.update(project).pipe(
        //             untilComponentDestroy.apply(this)).subscribe(() => {
        //                 this.toastService.success('La Obra ha sido finalizado correctamente');
        //                 this.pageChange();
        //             }, () => {
        //                 this.toastService.error('Error inesperado, contactar a su administrador.');
        //             });
        //     }
        // });
    }

    ngOnDestroy() { }

}
