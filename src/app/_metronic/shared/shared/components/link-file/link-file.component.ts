import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-link-file',
  templateUrl: './link-file.component.html',
  styleUrls: ['./link-file.component.scss']
})
export class LinkFileComponent implements OnChanges {

  @Input() href: string;
  @Input() name: string;
  @Input() isBlank = false;
  @Input() isDownload = false;

  constructor() { }

  ngOnChanges(): void {
    const isPdf = /(\.pdf|\.PDF)/g.test(this.href);
    if (isPdf) {
      this.isBlank = isPdf;
      this.href = this.href.replace('?download=true','');
    }
  }
}
