import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { Location } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { Client, Project } from '../../../@core/models';
import { ClientsService, ProjectsService } from '../../../@core/services';
import { Action, ToastService } from '../../../@theme/utils';
import { SharedFormService } from '../../../@theme/utils/form.service';

@Component({
  selector: 'ngx-functional-unit',
  templateUrl: './functional-unit.component.html',
})
@UnsubscribeOnDestroy()
export class FunctionalUnitComponent implements OnInit, OnDestroy {

  form: FormGroup;
  new = false;
  multiProjectId: string;
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
    private location: Location,
    protected dateService: NbDateService<Date>,
    public router: Router) { }

  ngOnInit() {
    this.multiProjectId = this.activatedRoute.snapshot.params.id;
    this.project = this.activatedRoute.snapshot.data['project'];
    this.new = !this.project;
    this.createForm();
    this.mapData();
    this.clients$ = this.clientsService.listClients();
    this.form.patchValue({ ['multiFamilyProject']: this.multiProjectId });
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      this.projectsService.save(this.new, this.form).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = this.new ? 'create' : 'update';
          this.toastService.showToast('La unidad funcional', action, 'success');
          this.return();
        }, () => {
          this.toastService.error('Error inesperado, contactar a su administrador.');
        });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: [],
      multiFamilyProject: [],
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
      this.form.patchValue({ ['client']: this.project.client._id });
      this.form.patchValue({ ['multiFamilyProject']: this.multiProjectId });
      if (this.project.state === 'Finalizado') {
        this.readOnly = true;
        this.form.disable();
      }
    }
  }

  public compareFn(a, b): boolean {
    return a === b;
  }

  return() {
    this.location.back();
  }

  ngOnDestroy() { }
}
