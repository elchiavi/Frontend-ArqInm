import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page, Project } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { ProjectsService } from '../../../@core/services';
import { ToastService } from '../../../@theme/utils/toast.service';
import { SortEvent, NgxSortableHeaderDirective, Sortable } from '../../../@theme/directives/sortable-header.directive';

@Component({
    selector: 'ngx-project-list',
    templateUrl: './project-list.component.html',
})
@UnsubscribeOnDestroy()
export class ProjectListComponent implements OnInit, OnDestroy, Sortable {

    @ViewChildren(NgxSortableHeaderDirective) headers: QueryList<NgxSortableHeaderDirective>;
    projectPage: Page<Project>;
    new = false;

    constructor(public toastService: ToastService,
        public projectsService: ProjectsService,
        public formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public dialogService: NbDialogService) { }

    ngOnInit() {
        this.pageChange();
    }

    pageChange(pageNumber?: number, filter?: string) {
        this.projectsService.getPage(pageNumber, filter).pipe(
            untilComponentDestroy.apply(this)).subscribe((projectPage: Page<Project>) => {
                this.projectPage = projectPage;
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
        this.projectsService.sortColumn = column;
        this.projectsService.sortDirection = direction;
        this.pageChange();
    }

    clear(inputSearch: any) {
        if (inputSearch.value !== '') {
            inputSearch.value = '';
            this.pageChange();
        }
    }

    ngOnDestroy() { }

}