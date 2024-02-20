import {ChangeDetectionStrategy, Component, computed, EventEmitter, inject, input, Output} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {LinkService} from '../../../services/link.service';
import {Tag} from '../../../models/tag.model';

@Component({
  selector: 'app-tag-usage-button',
  standalone: true,
  imports: [
    MatButton,
  ],
  templateUrl: './tag-usage-button.component.html',
  styleUrl: './tag-usage-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagUsageButtonComponent {
  linkService = inject(LinkService);

  tag = input.required<Tag>();
  @Output() showLinksUsing = new EventEmitter<Tag>();

  usages = computed(() => this.linkService.tagUsageCounts().get(this.tag().uuid) ?? 0)

  buttonText = computed(()=>{
    let number = this.usages();
    if(!number){
      return undefined;
    }
    let description = "usages";
    if(number == 1){
      description = "usage"
    }

    return `${number} ${description}`;
  })

  showLinksUsingFn($event: MouseEvent) {
    $event.stopPropagation();
    this.showLinksUsing.emit(this.tag());
  }
}
