import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-contact-modal',
  templateUrl: './delete-contact-modal.component.html',
  styleUrls: ['./delete-contact-modal.component.scss']
})
export class DeleteContactModalComponent implements OnInit {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  deleteCustomer() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.modal.close();
      // this.modal.dismiss(err);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
