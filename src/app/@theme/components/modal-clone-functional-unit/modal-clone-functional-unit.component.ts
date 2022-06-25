import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Observable } from 'rxjs';
import { untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { Client } from '../../../@core/models';
import { ClientsService, ProjectsService } from '../../../@core/services';
import { ToastService } from '../../utils';
import { SharedFormService } from '../../utils/form.service';

@Component({
    selector: 'ngx-modal-confirm',
    templateUrl: './modal-clone-functional-unit.component.html',
    styleUrls: ['./modal-clone-functional-unit.component.scss'],
})
export class ModalCloneFunctionalUnitComponent implements OnInit {

    @Input() title;
    @Input() message;
    @Input() project;
    form: FormGroup;
    clients$: Observable<Client[]>;

    constructor(public ref: NbDialogRef<ModalCloneFunctionalUnitComponent>,
        public formBuilder: FormBuilder,
        public clientsService: ClientsService,
        public formHelperService: SharedFormService,
        public toastService: ToastService,
        public projectsService: ProjectsService) { }


    ngOnInit() {
        this.createForm();
        this.mapData();
        this.clients$ = this.clientsService.listClients();
    }

    mapData() {
        this.form.patchValue({ ['_id']: this.project._id });
        this.form.patchValue({ ['multiFamilyProject']: this.project.multiFamilyProject });
    }

    createForm() {
        this.form = this.formBuilder.group({
            _id: [],
            multiFamilyProject: [],
            name: ['', Validators.required],
            client: [null, Validators.required],
            linkDrive: [null, Validators.required],
            streetNumber: [null, Validators.required],
            floor: [null, Validators.required],
            startDate: [null, Validators.required],
            termDays: [null, Validators.required],
        });
    }

    cloneFunctionalUnit() {
        this.formHelperService.touchAllFields(this.form);
        if (this.form.valid) {
            this.project.name = this.form.value.name;
            this.project.client = this.form.value.client;
            this.project.linkDrive = this.form.value.linkDrive;
            this.project.streetNumber = this.form.value.streetNumber;
            this.project.floor = this.form.value.floor;
            this.project.startDate = this.form.value.startDate;
            this.project.termDays = this.form.value.termDays;
            this.projectsService.cloneFunctionalUnit(this.project).pipe(
                untilComponentDestroy.apply(this)).subscribe(() => {
                    this.ref.close(true);
                }, (err) => {
                    this.toastService.error('Error inesperado, contactar a su administrador.');
                });
        }
    }
}
