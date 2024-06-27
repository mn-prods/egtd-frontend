import { Injectable } from '@angular/core';
import { BaseRepository } from '../common/services/base.repository';
import { ProjectCollection, ProjectDocument } from './entities/project.entity';

@Injectable({ providedIn: 'root' })
export class ProjectsRepository extends BaseRepository<ProjectDocument> {
  protected override collection!: ProjectCollection;

  constructor() {
    super('actions');
  }

  override setMiddleware(): void {}
}
