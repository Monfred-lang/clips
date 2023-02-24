import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit{

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList()

ngAfterContentInit(): void {
  const activeTabs = this.tabs.filter(tab => tab.active)
  if(activeTabs.length < 1) {
    this.selectTab(this.tabs.first)
  }
}

selectTab(tab: TabComponent) {
  this.tabs?.forEach(tab1 => {
    tab1.active = false
  })
  tab.active = true
  return false
}

}
