import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { Client, Project } from '../../../@core/models';
import { ClientsService, ProjectsService } from '../../../@core/services';
import { Action, ToastService } from '../../../@theme/utils';
import { SharedFormService } from '../../../@theme/utils/form.service';

@Component({
  selector: 'ngx-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
@UnsubscribeOnDestroy()
export class ProjectDetailComponent implements OnInit, OnDestroy {

  form: FormGroup;
  new = false;
  project: Project;
  clients$: Observable<Client[]>;
  clients: Client[];
  input$ = new Subject<string>();
  loading = false;
  readOnly = false;

  constructor(public formBuilder: FormBuilder,
    public projectsService: ProjectsService,
    public clientsService: ClientsService,
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
    this.clients$ = this.clientsService.listClients();
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      this.projectsService.save(this.new, this.form).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = this.new ? 'create' : 'update';
          this.toastService.showToast('El proyecto', action, 'success');
          this.router.navigate(['/pages/projects']);
        }, () => {
          this.toastService.error('Error inesperado, contactar a su administrador.');
        });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: [],
      name: ['', Validators.required],
      client: [null, Validators.required],
      linkDrive: [null, Validators.required],
      departure: [null, Validators.required],
      circ: [null, Validators.required],
      section: [null, Validators.required],
      apple: [null, Validators.required],
      plot: [null, Validators.required],
      street: [null, Validators.required],
      streetNumber: [null, Validators.required],
      additionalProject: [],
      floor: [''],
      province: ['', Validators.required],
      city: ['', Validators.required],
      startDate: [null, Validators.required],
      termDays: [null, Validators.required],
      typeProject: [null, Validators.required],
      type: [null, Validators.required],
      typeConstruction: [null, Validators.required],
      totalArea: [],
      lengthArea: [],
      widthArea: [],
      coveredArea: [],
      semiCoveredArea: [],
      uncoveredArea: [],
      waterMirror: [],
      sidewalk: [],
      zone: [null, Validators.required],
      fosPartOne: [null, Validators.required],
      fosPartTwo: [null, Validators.required],
      fotPartOne: [null, Validators.required],
      fotPartTwo: [null, Validators.required],
      dnmPartOne: [null, Validators.required],
      dnmPartTwo: [null, Validators.required],
      heightPartOne: [null, Validators.required],
      heightPartTwo: [null, Validators.required],
      lowLevel: [],
      levels: [],
      living: [],
      livingDining: [],
      dining: [],
      semiLiving: [],
      kitchen: [],
      diningKitchen: [],
      semiKitchen: [],
      ambienceDetail: [],
      masterBedroomWithSuiteAndDressing: [],
      masterBedroomWithSuite: [],
      masterBedroom: [],
      secondaryBedroom: [],
      secondaryBedroomAndDressing: [],
      flexSpace: [],
      bedRoomDetail: [],
      laundry: [],
      laundryPantry: [],
      pantry: [],
      deposit: [],
      serviceYard: [],
      variousDetail: [],
      bathroom: [],
      bathroomWithRestroom: [],
      bathService: [],
      outsideBathroom: [],
      bathroomDetail: [],
      coveredGarage: [],
      semiCoveredGarage: [],
      openGarage: [],
      entraceWall: [],
      entraceHall: [],
      garageDetail: [],
      blindGallery: [],
      translucentGallery: [],
      pergola: [],
      coveredLight: [],
      uncoveredLight: [],
      galleryDetail: [],
      fiberWaterMirror: [],
      concreteWaterMirror: [],
      quincho: [],
      grill: [],
      grillWithBar: [],
      mirrorDetail: [],
    });
  }

  mapData() {
    if (!this.new) {
      this.form.reset(this.project);
      this.form.patchValue({['client']: this.project.client._id});
    }
  }

  public compareFn(a, b): boolean {
    return a === b;
}

  ngOnDestroy() { }
}
