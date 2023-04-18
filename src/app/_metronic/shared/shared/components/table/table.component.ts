import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  // config
  @Input() border = true;
  @Input() radius = false;

  @Input() maxHeight: string;
  @Input() minHeight: string;
  @Input() maxWidth: string;
  @Input() className: string;
  @Input() classNameContainer: string;
  // Data
  @Input() data: any[] = [];
  @Input() paginator = false;
  // Event
  @Output() resize = new EventEmitter();
  @Output() paginate = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
