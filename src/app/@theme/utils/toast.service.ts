import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export type Status = 'success' | 'error';
export type Action = 'create' | 'update';
@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(private _toastrService: ToastrService) {
  }


  success(message: string) {
    this._toastrService.success(message, '¡Exito!');
  }

  warn(message: string) {
    this._toastrService.warning(message, '¡Atención!');
  }

  error(message: string) {
    this._toastrService.error(message, '¡Error!');
  }

  showToast(entity: string, action: Action, status: Status, plural: boolean = false) {
    let msg: string;
    switch (status) {
      case 'success':
        if (plural) {
          msg = action === 'create' ? `${entity} se crearon correctamente` : `${entity} se actualizaron correctamente`;
        } else {
          msg = action === 'create' ? `${entity} se creo correctamente` : `${entity} se actualizo correctamente`;
        }
        this.success(msg);
        break;
      case 'error':
        msg = action === 'create' ? `Ocurrio un error al crear ${entity.toLowerCase()}`
          : `Ocurrio un error al actualizar ${entity.toLowerCase()}`;
        this.error(msg);
        break;
    }
  }

}
