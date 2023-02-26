import { splitNsName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, combineLatest, firstValueFrom, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null> {

  pageClips: IClip[] = []
  pendingReq = false

  public clipsCollection: AngularFirestoreCollection<IClip>

  constructor(public db: AngularFirestore, private auth: AngularFireAuth, 
    private storage: AngularFireStorage, private router: Router) {
    this.clipsCollection = db.collection('clips')
   }

   createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data)
   }

   getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap(values => {
        const [user, sort] = values
        if(!user){ return of([])}
        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy('timestamp', sort === '1' ? 'desc' : 'asc')
        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
   }

   updateClip(id: string, title: string){
    return this.clipsCollection.doc(id).update({title})
   }

   async deleteClip(clip: IClip){
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)
    const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`)
    await clipRef.delete()
    await screenshotRef.delete()

    await this.clipsCollection.doc(clip.docId).delete()
   }

   async getClips() {
    console.log('getting clips')
    this.pendingReq = true
    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6)
    const { length } = this.pageClips

    if(length) {
      const lastDocId = this.pageClips[length - 1].docId
      const lastDoc = await firstValueFrom(this.clipsCollection.doc(lastDocId)
        .get())

        query = query.startAfter(lastDoc)
    }
    const snapshots= await query.get()

    snapshots.forEach(snapshot => {
      this.pageClips.push({
        docId: snapshot.id,
        ...snapshot.data()
      })
    })

    this.pendingReq = false
   }

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clipsCollection.doc(route.params.id).get()
      .pipe(
        map(snapshot => {
          const data = snapshot.data()

          if(!data) {
            this.router.navigate(['/'])
            return null
          }

          return data
        })
      )
   }
}
