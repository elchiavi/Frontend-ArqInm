import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, ThickMaterial, ThickMaterialBudget, ThickMaterialDetail } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { Action, ToastService } from '../../../@theme/utils/toast.service';
import {
    BudgetsService, ThickMaterialBudgetsService, ThickMaterialDetailsService, ThickMaterialsService,
} from '../../../@core/services';
import { Observable } from 'rxjs';
import { SharedFormService } from '../../../@theme/utils/form.service';
import { ModalConfirmComponent } from '../../../@theme/components';

@Component({
    selector: 'ngx-budget-thick-material',
    templateUrl: './budget-thick-material.component.html',
})
@UnsubscribeOnDestroy()
export class BudgetThickMaterialComponent implements OnInit, OnDestroy {

    form: FormGroup;
    @Input() budget: Budget;
    thickMaterial$: Observable<ThickMaterial[]>;
    thickMaterialDetail$: Observable<ThickMaterialDetail[]>;
    thickMaterialBudget: ThickMaterialBudget[];
    preCost: number;
    update = false;
    options = [
        { value: 'thickMaterial', label: 'Material Grueso' },
        { value: 'provider', label: 'Proveedor' },
    ];
    option = 'thickMaterial';


    constructor(public toastService: ToastService,
        public budgetsService: BudgetsService,
        public thickMaterialsService: ThickMaterialsService,
        public thickMaterialDetailsService: ThickMaterialDetailsService,
        public thickMaterialBudgetsService: ThickMaterialBudgetsService,
        public formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public formHelperService: SharedFormService,
        public router: Router,
        public dialogService: NbDialogService) { }

    ngOnInit() {
        this.loadPage();
        this.getThickMaterialBudgets();
    }

    resetForm() {
        this.formHelperService.cleanAllFields(this.form);
        this.update = false;
        this.form.get('thickMaterial').enable();
        this.form.get('thickMaterialDetail').enable();
        this.form.patchValue({ ['thickMaterial']: '' });
        this.form.patchValue({ ['thickMaterialDetail']: '' });
        this.form.patchValue({ ['provider']: '' });
        this.form.patchValue({ ['unitOfMeasurement']: '' });
        this.form.patchValue({ ['description']: '' });
        this.form.patchValue({ ['cant']: '' });
        this.form.patchValue({ ['unitCost']: '' });
    }

    loadPage() {
        this.createForm();
        this.thickMaterial$ = this.thickMaterialsService.listThickMaterial();
    }

    change() {
        const thickMatId = this.form.get('thickMaterial').value;
        this.thickMaterialDetail$ = this.thickMaterialDetailsService.listThickMaterialDetail(thickMatId);
    }

    getThickMaterialBudgets(filter?: string) {
        const id = this.budget[0]._id;
        this.thickMaterialBudgetsService.getThickMaterialBudgets(id, filter, this.option).pipe(
            untilComponentDestroy.apply(this)).subscribe((thickMaterialBudget: ThickMaterialBudget[]) => {
                this.thickMaterialBudget = thickMaterialBudget;
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
            thickMaterial: ['', Validators.required],
            thickMaterialDetail: ['', Validators.required],
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
            const thickMaterialBudget: ThickMaterialBudget = this.form.getRawValue();
            thickMaterialBudget.budget = this.budget[0]._id;
            this.thickMaterialBudgetsService.save(this.update, thickMaterialBudget).pipe(
                untilComponentDestroy.apply(this)).subscribe(() => {
                    const action: Action = this.update ? 'update' : 'create';
                    this.toastService.showToast('El material gruso ', action, 'success');
                    this.getBudget();
                    this.getThickMaterialBudgets();
                    this.resetForm();
                }, () => {
                    this.toastService.error('Error Inesperado, contacte a su administrador.');
                });
        }
    }

    deleteThickBudget(thickMaterialBudget: ThickMaterialBudget) {
        const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
        const description = `Se eliminará el registro ${thickMaterialBudget.thickMaterial.name} .`;
        modalRef.componentRef.instance.title = 'Confirmación';
        modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
        modalRef.onClose.subscribe((userResponse) => {
            if (userResponse) {
                this.thickMaterialBudgetsService.delete(thickMaterialBudget._id).pipe(
                    untilComponentDestroy.apply(this)).subscribe(() => {
                        this.toastService.success('Material grueso eliminado');
                        this.getBudget();
                        this.getThickMaterialBudgets();
                    }, () => {
                        this.toastService.error('Error Inesperado, contacte a su administrador.');
                    });
            }
        });
    }

    search(filter: string) {
        if (filter.length === 0) {
            this.getThickMaterialBudgets();
            return;
        } else if (filter.trim().length === 0) {
            return;
        } else if (filter.trim().length > 2) {
            this.getThickMaterialBudgets(filter);
        }
    }

    clear(inputSearch: any) {
        if (inputSearch.value !== '') {
            inputSearch.value = '';
            this.getThickMaterialBudgets();
        }
    }

    edit(thickMaterialBudget: ThickMaterialBudget) {
        this.preCost = thickMaterialBudget.cost;
        this.resetForm();
        this.update = true;
        this.form.get('_id').patchValue(thickMaterialBudget._id);
        this.form.get('description').patchValue(thickMaterialBudget.description);
        this.form.get('provider').patchValue(thickMaterialBudget.provider);
        this.form.get('cant').patchValue(thickMaterialBudget.cant);
        this.form.get('unitCost').patchValue(thickMaterialBudget.unitCost);
        this.form.get('unitOfMeasurement').patchValue(thickMaterialBudget.unitOfMeasurement);
        this.form.get('thickMaterial').patchValue(thickMaterialBudget.thickMaterial._id);
        this.change();
        this.form.get('thickMaterialDetail').patchValue(thickMaterialBudget.thickMaterialDetail._id);
        this.form.get('thickMaterial').disable();
        this.form.get('thickMaterialDetail').disable();
    }

    onlyInteger(event: any) {
        return event.keyCode >= 48 && event.keyCode <= 57;
    }

    ngOnDestroy() { }

}
