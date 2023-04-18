import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from 'src/app/modules/auth';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  @Input() public infoNhanVien: UserModel;

  constructor() {
  }

  ngOnInit(): void {
  }

}
