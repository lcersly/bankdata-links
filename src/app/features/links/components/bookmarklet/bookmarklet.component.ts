import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-bookmarklet',
  templateUrl: './bookmarklet.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./bookmarklet.component.scss'],
})
export class BookmarkletComponent {

  // language=JavaScript
  href = this.sanitizer.bypassSecurityTrustUrl(`javascript:(function () {
    var url = location.href;
    var title = document.title ||
      url;
    window.open("${document.documentURI}?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(title) + "&description=" + encodeURIComponent(document.getSelection()) + "&source=bookmarklet", "_blank", "menubar=no,height=700,width=500,toolbar=no,scrollbars=no,status=no,dialog=1");
  })();`);

  constructor(private sanitizer: DomSanitizer) {
  }

}
