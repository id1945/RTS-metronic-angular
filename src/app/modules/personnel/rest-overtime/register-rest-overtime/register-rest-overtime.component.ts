import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

interface Dashboard {
  PHEP_TRONG_NAM: number;
  PHEP_DA_NGHI: number;
  PHEP_CON_LAI: number;
  Message: string;
  ResponseStatus: number;
}

@Component({
  selector: 'app-register-rest-overtime',
  templateUrl: './register-rest-overtime.component.html',
  styleUrls: ['./register-rest-overtime.component.scss']
})
export class RegisterRestOvertimeComponent implements OnInit {

  public params: Params;
  public dashboard: Dashboard;

  constructor(
    private api: ApiService,
    private aRoute: ActivatedRoute,
  ) {
    this.aRoute.params.subscribe(params => {
      if (params) {
        this.params = params;
      }
    })
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard() {
    const headers = {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    };
    this.api.post('API/Mobile/Dashboard', null, headers).subscribe(res => {
      if (res?.ResponseStatus === 1) {
        this.dashboard = res?.ParameterOutput;
      }
    });
  }

}
