import { TypeDecorator, Type } from '@angular/core';

export function Container(container: Type<any>) {
  // tslint:disable-next-line: no-shadowed-variable
  const decorator: TypeDecorator = function TypeDecorator(cls: any) {
    cls.$$$container = container;
  } as TypeDecorator;
  return decorator;
}
