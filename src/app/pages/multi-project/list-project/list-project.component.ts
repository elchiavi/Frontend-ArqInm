import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiProject, Project } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { MultiProjectsService, ProjectsService } from '../../../@core/services';
import { Action, ToastService } from '../../../@theme/utils/toast.service';
import { NgxSortableHeaderDirective } from '../../../@theme/directives/sortable-header.directive';
import { ModalCloneFunctionalUnitComponent } from '../../../@theme/components/modal-clone-functional-unit/modal-clone-functional-unit.component';

@Component({
    selector: 'ngx-multi-project-list',
    templateUrl: './list-project.component.html',
    styleUrls: ['./list-project.component.scss'],
})
@UnsubscribeOnDestroy()
export class ListProjectComponent implements OnInit, OnDestroy {

    @ViewChildren(NgxSortableHeaderDirective) headers: QueryList<NgxSortableHeaderDirective>;
    projects: Project[];
    name: string;
    multiProjectId: string;

    constructor(public toastService: ToastService,
        public projectsService: ProjectsService,
        public multiProjectsService: MultiProjectsService,
        public formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public dialogService: NbDialogService) { }

    ngOnInit() {
        this.multiProjectId = this.activatedRoute.snapshot.params.id;
        this.multiProjectsService.get(this.multiProjectId).pipe(
            untilComponentDestroy.apply(this)).subscribe((multiProject: MultiProject) => {
                this.name = multiProject.name;
            });
        this.loadProjects();
    }

    loadProjects(pageNumber?: number, filter?: string) {
        this.projectsService.getMultiProject(this.activatedRoute.snapshot.params.id).pipe(
            untilComponentDestroy.apply(this)).subscribe((projects: Project[]) => {
                this.projects = projects;
            });
    }

    cloneFunctionalUnit(project: Project) {
        const modalRef = this.dialogService.open(ModalCloneFunctionalUnitComponent, { closeOnBackdropClick: false });
        const description = 'Se clonará la Unidad Funcional';
        modalRef.componentRef.instance.title = 'Confirmación';
        modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
        modalRef.componentRef.instance.project = project;
        modalRef.onClose.subscribe((userResponse) => {
            if (userResponse) {
                const action: Action = 'create';
                this.toastService.showToast('La unidad funcional', action, 'success');
                this.loadProjects();
            }
        });
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
