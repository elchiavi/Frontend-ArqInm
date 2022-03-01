import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const UnsubscribeOnDestroy = () =>
    (target: any) => {

        const ngOnDestroy = target.prototype.ngOnDestroy;

        if (typeof ngOnDestroy !== 'function') {
            console.warn(`${target.name} is using @UnsubscribeOnDestroy() but does not implement OnDestroy`);
        }

        target.prototype.ngOnDestroy = function() {
            if (ngOnDestroy && typeof ngOnDestroy === 'function') {
                ngOnDestroy.apply(this, arguments);
            }
            if (this._ngUnsubscribe) {
                this._ngUnsubscribe.next();
                this._ngUnsubscribe.complete();
                this._ngUnsubscribe = null;
            }
        };

        return target;
    };


export const untilComponentDestroy = function() {
    this._ngUnsubscribe = this._ngUnsubscribe || new Subject();
    return takeUntil(this._ngUnsubscribe);
};
