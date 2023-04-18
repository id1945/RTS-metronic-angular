import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-approve-rest-overtime',
  templateUrl: './approve-rest-overtime.component.html',
  styleUrls: ['./approve-rest-overtime.component.scss']
})
export class ApproveRestOvertimeComponent implements OnInit {

  public params: Params;
  public selectedIndex: number = 0;

  constructor(
    private aRoute: ActivatedRoute,
  ) {
    this.aRoute.params.subscribe(params => {
      if (params) {
        this.params = params;
      }
    })
  }

  ngOnInit(): void {
  }
}
