import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, InstallationMaterial, InstallationMaterialBudget, InstallationMaterialDetail } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { Action, ToastService } from '../../../@theme/utils/toast.service';
import {
    BudgetsService, InstallationMaterialBudgetsService, InstallationMaterialDetailsService,
    InstallationMaterialsService,
} from '../../../@core/services';
import { Observable } from 'rxjs';
import { SharedFormService } from '../../../@theme/utils/form.service';
import { ModalConfirmComponent } from '../../../@theme/components';

@Component({
    selector: 'ngx-budget-installation-material',
    templateUrl: './budget-installation-material.component.html',
})
@UnsubscribeOnDestroy()
export class BudgetInstallationMaterialComponent implements OnInit, OnDestroy {

    form: FormGroup;
    @Input() budget: Budget;
    installationMaterial$: Observable<InstallationMaterial[]>;
    installationMaterialDetail$: Observable<InstallationMaterialDetail[]>;
    installationMaterialBudget: InstallationMaterialBudget[];
    preCost: number;
    update = false;
    options = [
        { value: 'installationMaterial', label: 'Material de Instalación' },
        { value: 'provider', label: 'Proveedor' },
    ];
    option = 'installationMaterial';


    constructor(public toastService: ToastService,
        public budgetsService: BudgetsService,
        public installationMaterialsService: InstallationMaterialsService,
        public installationMaterialDetailsService: InstallationMaterialDetailsService,
        public installationMaterialBudgetsService: InstallationMaterialBudgetsService,
        public formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public formHelperService: SharedFormService,
        public router: Router,
        public dialogService: NbDialogService) { }

    ngOnInit() {
        this.loadPage();
        this.getInstallationMaterialBudgets();
    }

    resetForm() {
        this.formHelperService.cleanAllFields(this.form);
        this.update = false;
        this.form.get('installationMaterial').enable();
        this.form.get('installationMaterialDetail').enable();
        this.form.patchValue({ ['installationMaterial']: '' });
        this.form.patchValue({ ['installationMaterialDetail']: '' });
        this.form.patchValue({ ['provider']: '' });
        this.form.patchValue({ ['unitOfMeasurement']: '' });
        this.form.patchValue({ ['description']: '' });
        this.form.patchValue({ ['cant']: '' });
        this.form.patchValue({ ['unitCost']: '' });
    }

    loadPage() {
        this.createForm();
        this.installationMaterial$ = this.installationMaterialsService.listInstallationMaterial();
    }

    change() {
        const installationMatId = this.form.get('installationMaterial').value;
        this.installationMaterialDetail$ =
            this.installationMaterialDetailsService.listInstallationMaterialDetail(installationMatId);
    }

    getInstallationMaterialBudgets(filter?: string) {
        const id = this.budget[0]._id;
        this.installationMaterialBudgetsService.getInstallationMaterialBudgets(id, filter, this.option).pipe(
            untilComponentDestroy.apply(this)).subscribe((installationMaterialBudget: InstallationMaterialBudget[]) => {
                this.installationMaterialBudget = installationMaterialBudget;
            });
    }

    getBudget() {
        this.budgetsService.getBudgetForId(this.budget[0]._id).pipe(
            untilComponentDestroy.apply(this)).subscribe((budget: Budget) => {
                this.budget[0] = budget;
            });
    }

    createForm() {
        this.form = this.formBuilder.group({
            _id: [],
            installationMaterial: ['', Validators.required],
            installationMaterialDetail: ['', Validators.required],
            provider: ['', Validators.required],
            cant: ['', Validators.required],
            unitOfMeasurement: ['', Validators.required],
            unitCost: ['', Validators.required],
            description: [''],
        });
    }

    save() {
        this.formHelperService.touchAllFields(this.form);
        if (this.form.valid) {
            const installationMaterialBudget: InstallationMaterialBudget = this.form.getRawValue();
            installationMaterialBudget.budget = this.budget[0]._id;
            this.installationMaterialBudgetsService.save(this.update, installationMaterialBudget).pipe(
                untilComponentDestroy.apply(this)).subscribe(() => {
                    const action: Action = this.update ? 'update' : 'create';
                    this.toastService.showToast('El material de instalación ', action, 'success');
                    this.getBudget();
                    this.getInstallationMaterialBudgets();
                    this.resetForm();
                }, () => {
                    this.toastService.error('Error Inesperado, contacte a su administrador.');
                });
        }
    }

    deleteInstallationBudget(installationMaterialBudget: InstallationMaterialBudget) {
        const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
        const description = `Se eliminará el registro ${installationMaterialBudget.installationMaterial.name} .`;
        modalRef.componentRef.instance.title = 'Confirmación';
        modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
        modalRef.onClose.subscribe((userResponse) => {
            if (userResponse) {
                this.installationMaterialBudgetsService.delete(installationMaterialBudget._id).pipe(
                    untilComponentDestroy.apply(this)).subscribe(() => {
                        this.toastService.success('Material de instalación eliminado');
                        this.getBudget();
                        this.getInstallationMaterialBudgets();
                    }, () => {
                        this.toastService.error('Error Inesperado, contacte a su administrador.');
                    });
            }
        });
    }

    search(filter: string) {
        if (filter.length === 0) {
            this.getInstallationMaterialBudgets();
            return;
        } else if (filter.trim().length === 0) {
            return;
        } else if (filter.trim().length > 2) {
            this.getInstallationMaterialBudgets(filter);
        }
    }

    clear(inputSearch: any) {
        if (inputSearch.value !== '') {
            inputSearch.value = '';
            this.getInstallationMaterialBudgets();
        }
    }

    edit(installationMaterialBudget: InstallationMaterialBudget) {
        this.preCost = installationMaterialBudget.cost;
        this.resetForm();
        this.update = true;
        this.form.get('_id').patchValue(installationMaterialBudget._id);
        this.form.get('description').patchValue(installationMaterialBudget.description);
        this.form.get('provider').patchValue(installationMaterialBudget.provider);
        this.form.get('cant').patchValue(installationMaterialBudget.cant);
        this.form.get('unitCost').patchValue(installationMaterialBudget.unitCost);
        this.form.get('unitOfMeasurement').patchValue(installationMaterialBudget.unitOfMeasurement);
        this.form.get('installationMaterial').patchValue(installationMaterialBudget.installationMaterial._id);
        this.change();
        this.form.get('installationMaterialDetail')
            .patchValue(installationMaterialBudget.installationMaterialDetail._id);
        this.form.get('installationMaterial').disable();
        this.form.get('installationMaterialDetail').disable();
    }

    onlyInteger(event: any) {
        return event.keyCode >= 48 && event.keyCode <= 57;
    }

    ngOnDestroy() { }

}
