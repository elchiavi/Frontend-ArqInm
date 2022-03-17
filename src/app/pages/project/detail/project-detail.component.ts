import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { Project } from '../../../@core/models';
import { ProjectsService } from '../../../@core/services';
import { Action, ToastService } from '../../../@theme/utils';
import { SharedFormService } from '../../../@theme/utils/form.service';
import { SharedFormValidation } from '../../../@theme/utils/form.validation';

@Component({
  selector: 'ngx-project-detail',
  templateUrl: './project-detail.component.html',
})
@UnsubscribeOnDestroy()
export class ProjectDetailComponent implements OnInit, OnDestroy {

  form: FormGroup;
  new = false;
  project: Project;
  readOnly = false;
  day: number;
  month: number;
  year: number;

  constructor(public formBuilder: FormBuilder,
    public projectsService: ProjectsService,
    public toastService: ToastService,
    public activatedRoute: ActivatedRoute,
    public formHelperService: SharedFormService,
    protected dateService: NbDateService<Date>,
    public router: Router) { }

  ngOnInit() {
    this.project = this.activatedRoute.snapshot.data['project'];
    this.new = !this.project;
    this.readOnly = !this.new;
    this.createForm();
    this.mapData();
    this.day = new Date().getDate();
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      this.projectsService.save(this.new, this.form).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = this.new ? 'create' : 'update';
          this.toastService.showToast('El usuario', action, 'success');
          this.router.navigate(['/pages/users']);
        }, () => {
          this.toastService.error('El mail ingresado ya fue registrado.');
        });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [],
      name: ['', Validators.required],
      client: [null, Validators.required],
      linkDrive: [null, Validators.required],
      cadastral: [null, Validators.required],
      street: [null, Validators.required],
      streetNumber: [null, Validators.required],
      startDate: [null, Validators.required],
      termDays: [null, Validators.required],
      typeProject: [null, Validators.required],
      type: [null, Validators.required],
      totalArea: [],
      coveredArea: [],
      semiCoveredArea: [],
      uncoveredArea: [],
      waterMirror: [],
      sidewalk: [],
    });
  }

  mapData() {
    if (!this.new) {
      this.form.reset(this.project);
    }
  }

  ngOnDestroy() { }
}