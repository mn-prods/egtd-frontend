import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform<T, F extends keyof T>(
    array: T[],
    field: F,
    value: T[F],
    disabled?: boolean
  ): T[] {
    if (disabled) return array;

    return [...array].filter((item) => item[field] === value);
  }
}
