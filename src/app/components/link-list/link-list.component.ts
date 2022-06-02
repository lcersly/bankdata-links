import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LinkService} from "../../services/link.service";
import {Link} from "../../models/link.model";
import {DataSource} from "@angular/cdk/collections";
import {Observable, ReplaySubject} from "rxjs";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkListComponent implements OnInit {
  displayedColumns: string[] = ['icon', 'name', 'url'];
  dataSource: ExampleDataSource = new ExampleDataSource([], this.sanitizer);

  constructor(private linkService: LinkService, private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.linkService.links$.subscribe(data => {
      this.dataSource.setData(data);
    });
  }

}

class ExampleDataSource extends DataSource<Link> {
  private _dataStream = new ReplaySubject<Link[]>();

  constructor(initialData: Link[], private sanitizer: DomSanitizer) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Link[]> {
    return this._dataStream;
  }

  disconnect() {
  }

  setData(data: Link[]) {
    this._dataStream.next(data.map(link => ({...link})));
  }
}
