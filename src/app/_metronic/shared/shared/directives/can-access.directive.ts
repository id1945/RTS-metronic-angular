import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';

@Directive({
  selector: '[appCanAccess]'
})
export class CanAccessDirective {

  @Input() public appCanAccess: string | string[] | any[];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private menu: DynamicAsideMenuService
  ) { }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.applyPermission();
  }

  private async applyPermission(): Promise<void> {
    if (!this.menu.menuPermission$.value) {
      await this.menu.loadPermissions();
    }
    if (typeof this.appCanAccess === 'object') {
      // Được hiển thị màn hình
      let isAccept = this.menu.menuPermission$.value?.find(p => (this.appCanAccess as any[])?.find(x => x?.screenKey === p?.controller || x?.screenKey === 'allow'))
      if (isAccept) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        // không cho phép hiển thị
        this.viewContainer.clear();
      }
    }
    if (typeof this.appCanAccess === 'string') {
      // Được hiển thị màn hình
      let isAccept = this.menu.menuPermission$.value?.find(f => f?.controller === this.appCanAccess || this.appCanAccess === 'allow')
      if (isAccept) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        // không cho phep hiển thị
        this.viewContainer.clear();
      }
    }
  }

}