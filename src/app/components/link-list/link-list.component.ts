import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LinkService} from '../../services/firestore/link.service';
import {Link} from '../../models/link.model';
import {DataSource} from '@angular/cdk/collections';
import {Observable, ReplaySubject} from 'rxjs';
import {FormBuilder, FormControl} from '@angular/forms';

@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkListComponent implements OnInit {
  displayedColumns: string[] = ['icon', 'url', 'environment', 'tags', 'section'];
  dataSource: ExampleDataSource = new ExampleDataSource([]);
  groupedList = new Map<string, Link[]>()
  filteredList = new Map<string, Link[]>()

  environments: Set<string> = new Set<string>();
  searchForm = this.fb.group({
    searchString: this.fb.control(''),
    environment: this.fb.control(''),
  });

  constructor(private linkService: LinkService, private fb: FormBuilder) {
  }

  get envControl() {
    return this.searchForm.get('environment') as FormControl
  }

  get searchControl() {
    return this.searchForm.get('searchString') as FormControl
  }

  ngOnInit(): void {
    // this.linkService.links$.subscribe(links => {
    //   this.dataSource.setData(links);
    //
    //   this.groupedList = new Map<string, Link[]>();
    //   const envList = new Set<string>();
    //
    //   for (const link of links) {
    //     let links = this.groupedList.get(link.section);
    //     if (!links) {
    //       links = [];
    //       this.groupedList.set(link.section, links);
    //     }
    //     links.push(link);
    //
    //     if (link.environment) {
    //       envList.add(link.environment);
    //     }
    //   }
    //
    //   this.environments = envList;
    //   this.envControl.setValue([...envList])
    //   this.searchChange();
    // });

    this.searchForm.valueChanges.subscribe(() => this.searchChange());
  }

  searchChange() {
    let searchValue = this.searchControl.value?.trim();
    if (!searchValue && this.envControl.value?.length === this.environments.size) {
      this.filteredList = this.groupedList;
    } else {
      const list = new Map<string, Link[]>();
      for (const section of this.groupedList) {
        let links = section[1].filter(link => this.linkMatch(link, searchValue, this.envControl.value));
        if (links.length) {
          list.set(section[0], links);
        }
      }
      this.filteredList = list;
    }
  }

  linkMatch(link: Link, searchString: string | undefined, environments: string[]) {
    if (!environments.find(env => link.environment === env)) {
      return false;
    }

    if (!searchString) return true;
    const concat = (link.section + link.url + link.name + link.description + link.tags?.join()).toLowerCase();
    return concat.includes(searchString.toLowerCase());
  }
}

class ExampleDataSource extends DataSource<Link> {
  private _dataStream = new ReplaySubject<Link[]>();

  constructor(initialData: Link[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Link[]> {
    return this._dataStream;
  }

  disconnect() {
  }

  setData(data: Link[]) {
    this._dataStream.next(data);
  }
}
