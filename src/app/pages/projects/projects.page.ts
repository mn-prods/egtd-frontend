import { Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  standalone: true,
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrl: './projects.page.scss',
  imports: [MatCard]
})
export class ProjectsPage {
    navigation = inject(NavigationService);

    constructor() {
        this.navigation.settings.next({
            toolbar: true, 
            showSidenavBtn: true,
            toolbarHeader: 'projects.toolbar'
        })
    }
}
