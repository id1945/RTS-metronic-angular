import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Options } from 'src/app/_metronic/shared/shared/models/options';

@Component({
  selector: 'app-select-tags-button',
  templateUrl: './select-tags-button.component.html',
  styleUrls: ['./select-tags-button.component.scss']
})
export class SelectTagsButtonComponent implements OnInit {

  @Input() tags: Options[] = [];
  @Input() btnLable: string;
  @Output() tagsChange = new EventEmitter();
  @Output() onAdd = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public remove(idx) {
    this.tags = this.tags.filter((f, i) => i !== idx);
    this.tagsChange.emit(this.tags);
  }

}
