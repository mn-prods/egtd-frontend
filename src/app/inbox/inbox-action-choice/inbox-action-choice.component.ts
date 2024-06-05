import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute } from '@angular/router';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';


@Component({
  selector: 'app-inbox-action-choice',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule
  ],
  templateUrl: './inbox-action-choice.component.html',
  styleUrl: './inbox-action-choice.component.scss'
})
export class InboxActionChoiceComponent implements OnInit {
  route = inject(ActivatedRoute);
  item?: InboxDocument;

  ngOnInit(): void {
    this.item = this.route.snapshot.data['item'];
  }


}

