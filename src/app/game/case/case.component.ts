import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
