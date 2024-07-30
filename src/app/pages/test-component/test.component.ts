import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {
  route = inject(ActivatedRoute);
  ngOnInit(): void {
    console.log('hi')
    console.log(this.route.snapshot);
  }
}
