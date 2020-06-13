import { NgElementStrategy, NgElementStrategyEvent } from '@angular/elements';
import { Observable, merge } from 'rxjs';
import {
  SimpleChanges,
  ComponentRef,
  ComponentFactory,
  Injector,
  OnChanges,
  ApplicationRef,
  SimpleChange,
  EventEmitter,
} from '@angular/core';
import { isFunction, scheduler, strictEquals } from './util';
import { extractProjectableNodes } from './extract-projectable-nodes';
import { map } from 'rxjs/operators';
/** Time in milliseconds to wait before destroying the component ref when disconnected. */
const DESTROY_DELAY = 10;

export class CustomComponentNgElementStrategy implements NgElementStrategy {
  /** Merged stream of the component's output events. */
  // TODO(issue/24571): remove '!'.
  events!: Observable<NgElementStrategyEvent>;

  /** Reference to the component that was created on connect. */
  // TODO(issue/24571): remove '!'.
  private componentRef!: ComponentRef<any> | null;

  /** Changes that have been made to the component ref since the last time onChanges was called. */
  private inputChanges: SimpleChanges | null = null;

  /** Whether the created component implements the onChanges function. */
  private implementsOnChanges = false;

  /** Whether a change detection has been scheduled to run on the component. */
  private scheduledChangeDetectionFn: (() => void) | null = null;

  /** Callback function that when called will cancel a scheduled destruction on the component. */
  private scheduledDestroyFn: (() => void) | null = null;

  /** Initial input values that were set before the component was created. */
  private readonly initialInputValues = new Map<string, any>();

  /**
   * Set of component inputs that have not yet changed, i.e. for which `ngOnChanges()` has not
   * fired. (This is used to determine the value of `fistChange` in `SimpleChange` instances.)
   */
  private readonly unchangedInputs = new Set<string>();

  constructor(
    private componentFactory: ComponentFactory<any>,
    private injector: Injector
  ) {}

  /**
   * Initializes a new component if one has not yet been created and cancels any scheduled
   * destruction.
   */
  connect(element: HTMLElement) {
    // If the element is marked to be destroyed, cancel the task since the component was reconnected
    if (this.scheduledDestroyFn !== null) {
      this.scheduledDestroyFn();
      this.scheduledDestroyFn = null;
      return;
    }

    if (!this.componentRef) {
      this.initializeComponent(element);
    }
  }

  /**
   * Schedules the component to be destroyed after some small delay in case the element is just
   * being moved across the DOM.
   */
  disconnect() {
    // Return if there is no componentRef or the component is already scheduled for destruction
    if (!this.componentRef || this.scheduledDestroyFn !== null) {
      return;
    }

    // Schedule the component to be destroyed after a small timeout in case it is being
    // moved elsewhere in the DOM
    this.scheduledDestroyFn = scheduler.schedule(() => {
      if (this.componentRef) {
        this.componentRef!.destroy();
        this.componentRef = null;
      }
    }, DESTROY_DELAY);
  }

  /**
   * Returns the component property value. If the component has not yet been created, the value is
   * retrieved from the cached initialization values.
   */
  getInputValue(property: string): any {
    if (!this.componentRef) {
      return this.initialInputValues.get(property);
    }

    return (this.componentRef.instance as any)[property];
  }

  /**
   * Sets the input value for the property. If the component has not yet been created, the value is
   * cached and set when the component is created.
   */
  setInputValue(property: string, value: any): void {
    if (!this.componentRef) {
      this.initialInputValues.set(property, value);
      return;
    }

    // Ignore the value if it is strictly equal to the current value, except if it is `undefined`
    // and this is the first change to the value (because an explicit `undefined` _is_ strictly
    // equal to not having a value set at all, but we still need to record this as a change).
    if (
      strictEquals(value, this.getInputValue(property)) &&
      !(value === undefined && this.unchangedInputs.has(property))
    ) {
      return;
    }

    this.recordInputChange(property, value);
    (this.componentRef.instance as any)[property] = value;
    this.scheduleDetectChanges();
  }

  /**
   * Creates a new component through the component factory with the provided element host and
   * sets up its initial inputs, listens for outputs changes, and runs an initial change detection.
   */
  protected initializeComponent(element: HTMLElement) {
    const childInjector = Injector.create({
      providers: [],
      parent: this.injector,
    });
    const projectableNodes = extractProjectableNodes(
      element,
      this.componentFactory.ngContentSelectors
    );
    this.componentRef = this.componentFactory.create(
      childInjector,
      projectableNodes,
      element
    );

    this.implementsOnChanges = isFunction(
      ((this.componentRef.instance as any) as OnChanges).ngOnChanges
    );

    this.initializeInputs();
    this.initializeOutputs();
    this.initializeMethods(element);

    this.detectChanges();

    const applicationRef = this.injector.get<ApplicationRef>(ApplicationRef);
    applicationRef.attachView(this.componentRef.hostView);
  }

  protected initializeMethods(element: HTMLElement): void {
    const methods = Reflect.getMetadata(
      'custom-element-methods',
      this.componentFactory.componentType
    );

    if (methods) {
      for (const method of methods) {
        if (isFunction(this.componentRef.instance[method])) {
          element[method] = (...args) => {
            return this.componentRef.instance[method](...args);
          };
        } else {
          const getter = () => {
            return this.componentRef.instance[method];
          };
          Object.defineProperty(element, method, {
            get: getter,
            enumerable: true,
            configurable: true,
          });
        }
      }
    }
  }

  getAllMethods(object) {
    return Object.getOwnPropertyNames(object).filter((property) => {
      return typeof object[property] === 'function';
    });
  }
  /** Set any stored initial inputs on the component's properties. */
  protected initializeInputs(): void {
    this.componentFactory.inputs.forEach(({ propName }) => {
      if (this.implementsOnChanges) {
        // If the component implements `ngOnChanges()`, keep track of which inputs have never
        // changed so far.
        this.unchangedInputs.add(propName);
      }

      if (this.initialInputValues.has(propName)) {
        // Call `setInputValue()` now that the component has been instantiated to update its
        // properties and fire `ngOnChanges()`.
        this.setInputValue(propName, this.initialInputValues.get(propName));
      }
    });

    this.initialInputValues.clear();
  }

  /** Sets up listeners for the component's outputs so that the events stream emits the events. */
  protected initializeOutputs(): void {
    const eventEmitters = this.componentFactory.outputs.map(
      ({ propName, templateName }) => {
        const emitter = (this.componentRef!.instance as any)[
          propName
        ] as EventEmitter<any>;
        return emitter.pipe(
          map((value: any) => ({ name: templateName, value }))
        );
      }
    );

    this.events = merge(...eventEmitters);
  }

  /** Calls ngOnChanges with all the inputs that have changed since the last call. */
  protected callNgOnChanges(): void {
    if (!this.implementsOnChanges || this.inputChanges === null) {
      return;
    }

    // Cache the changes and set inputChanges to null to capture any changes that might occur
    // during ngOnChanges.
    const inputChanges = this.inputChanges;
    this.inputChanges = null;
    ((this.componentRef!.instance as any) as OnChanges).ngOnChanges(
      inputChanges
    );
  }

  /**
   * Schedules change detection to run on the component.
   * Ignores subsequent calls if already scheduled.
   */
  protected scheduleDetectChanges(): void {
    if (this.scheduledChangeDetectionFn) {
      return;
    }

    this.scheduledChangeDetectionFn = scheduler.scheduleBeforeRender(() => {
      this.scheduledChangeDetectionFn = null;
      this.detectChanges();
    });
  }

  /**
   * Records input changes so that the component receives SimpleChanges in its onChanges function.
   */
  protected recordInputChange(property: string, currentValue: any): void {
    // Do not record the change if the component does not implement `OnChanges`.
    if (this.componentRef && !this.implementsOnChanges) {
      return;
    }

    if (this.inputChanges === null) {
      this.inputChanges = {};
    }

    // If there already is a change, modify the current value to match but leave the values for
    // previousValue and isFirstChange.
    const pendingChange = this.inputChanges[property];
    if (pendingChange) {
      pendingChange.currentValue = currentValue;
      return;
    }

    const isFirstChange = this.unchangedInputs.has(property);
    this.unchangedInputs.delete(property);

    const previousValue = isFirstChange
      ? undefined
      : this.getInputValue(property);
    this.inputChanges[property] = new SimpleChange(
      previousValue,
      currentValue,
      isFirstChange
    );
  }

  /** Runs change detection on the component. */
  protected detectChanges(): void {
    if (!this.componentRef) {
      return;
    }

    this.callNgOnChanges();
    this.componentRef!.changeDetectorRef.detectChanges();
  }
}
