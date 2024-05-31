import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'asString', pure: true })
export class AsStringPipe implements PipeTransform {
  transform(input: unknown): string {
    return input as string;
  }
}
