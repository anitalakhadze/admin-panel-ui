import {
  ComponentFactory,
  ComponentFactoryResolver, ComponentRef,
  Directive,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatButton} from "@angular/material/button";
import {ThemePalette} from "@angular/material/core";

@Directive({
  selector: `button[mat-button][loading], button[mat-raised-button][loading], button[mat-icon-button][loading],
             button[mat-fab][loading], button[mat-mini-fab][loading], button[mat-stroked-button][loading],
             button[mat-flat-button][loading]`,
})
export class MatButtonLoadingDirective implements OnChanges{
  private spinnerFactory: ComponentFactory<MatProgressSpinner>;
  private spinner: ComponentRef<MatProgressSpinner> | undefined;

  @Input()
  loading: boolean | undefined;

  @Input()
  disabled: boolean | undefined;

  @Input()
  color: ThemePalette;

  constructor(
    private matButton: MatButton,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {
    this.spinnerFactory = this.componentFactoryResolver.resolveComponentFactory(MatProgressSpinner);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.loading) {
      return;
    }

    if (changes.loading.currentValue) {
      this.matButton._elementRef.nativeElement.classList.add('mat-loading');
      this.matButton.disabled = true;
      this.createSpinner();
    } else if (!changes.loading.firstChange) {
      this.matButton._elementRef.nativeElement.classList.remove('mat-loading');
      if (this.disabled) {
        this.matButton.disabled = this.disabled;
      }
      this.destroySpinner();
    }
  }

  private createSpinner(): void {
    if (!this.spinner) {
      this.spinner = this.viewContainerRef.createComponent(this.spinnerFactory);
      this.spinner.instance.color = this.color;
      this.spinner.instance.diameter = 20;
      this.spinner.instance.mode = 'indeterminate';
      this.renderer.appendChild(this.matButton._elementRef.nativeElement, this.spinner.instance._elementRef.nativeElement);
    }
  }

  private destroySpinner(): void {
    if (this.spinner) {
      this.spinner.destroy();
      // this.spinner = null;
    }
  }

}