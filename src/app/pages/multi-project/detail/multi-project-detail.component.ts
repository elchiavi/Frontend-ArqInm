import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { Client, MultiProject } from '../../../@core/models';
import { ClientsService, MultiProjectsService } from '../../../@core/services';
import { Action, ToastService } from '../../../@theme/utils';
import { SharedFormService } from '../../../@theme/utils/form.service';

@Component({
  selector: 'ngx-multi-project-detail',
  templateUrl: './multi-project-detail.component.html',
  styleUrls: ['./multi-project-detail.component.scss'],
})
@UnsubscribeOnDestroy()
export class MultiProjectDetailComponent implements OnInit, OnDestroy {

  form: FormGroup;
  new = false;
  multiProject: MultiProject;
  clients$: Observable<Client[]>;
  clients: Client[];
  input$ = new Subject<string>();
  loading = false;
  readOnly = false;

  constructor(public formBuilder: FormBuilder,
    public multiProjectsService: MultiProjectsService,
    public clientsService: ClientsService,
    public toastService: ToastService,
    public activatedRoute: ActivatedRoute,
    public formHelperService: SharedFormService,
    protected dateService: NbDateService<Date>,
    public router: Router) { }

  ngOnInit() {
    this.multiProject = this.activatedRoute.snapshot.data['multiProject'];
    this.new = !this.multiProject;
    this.createForm();
    this.mapData();
    this.clients$ = this.clientsService.listClients();
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      this.multiProjectsService.save(this.new, this.form).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = this.new ? 'create' : 'update';
          this.toastService.showToast('El proyecto multi familiar', action, 'success');
          this.router.navigate(['/pages/multiProjects']);
        }, () => {
          this.toastService.error('Error inesperado, contactar a su administrador.');
        });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: [],
      name: ['', Validators.required],
      startDate: [null, Validators.required],
    });
  }

  mapData() {
    if (!this.new) {
      this.form.reset(this.multiProject);
    //   if (this.project.state === 'Finalizado') {
    //     this.readOnly = true;
    //     this.form.disable();
    //   }
    }
  }

  public compareFn(a, b): boolean {
    return a === b;
}

  ngOnDestroy() { }
}
