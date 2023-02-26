import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import IClip from '../../models/clip.model'

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1'
  clips: IClip[] = []
  activeClip: IClip | null = null
  sort$: BehaviorSubject<string>

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private clipsService: ClipService,
    private modal: ModalService){
      this.sort$ = new BehaviorSubject(this.videoOrder)
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1'
      this.sort$.next(this.videoOrder)
    })
    
    this.clipsService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = []
      docs.forEach(doc => {
        this.clips.push({
          docId: doc.id,
          ...doc.data()
        })
      })
    })
  }

  sort(event: Event){
    const { value } = event.target as HTMLSelectElement
    this.router.navigate([], {
      relativeTo: this.route, queryParams: {sort: value}
    })
  }

  openModal($event: Event, clip: IClip){
    $event.preventDefault();
    this.activeClip = clip;
    this.modal.toggleModal('editModal')
  }

  update(event: IClip){
    this.clips.forEach((element, index) => {
      if(element.docId === event.docId){
        this.clips[index].title = event.title
      }
    })

    setTimeout(() => {
      this.modal.toggleModal('editModal')
    },1000)
  }

  async delete(event: Event, clip: IClip){
    event.preventDefault()
    try {
      await this.clipsService.deleteClip(clip)      
    } catch (error) {
      return
    }
    this.clips.forEach((element, index) => {
      if(element.docId === clip.docId){
        this.clips.splice(index,1)
      }
    })
  }

  async copyToClipboard($event: MouseEvent, docId: string | undefined) {
    $event.preventDefault()

    if(!docId) { return }

    const url = `${location.origin}/clip/${docId}`
    await navigator.clipboard.writeText(url)

    alert('Link Copied')

  }

}
