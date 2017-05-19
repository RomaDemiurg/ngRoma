import { Component, Input, OnInit, NgZone } from '@angular/core';
import '../../../configs/firebase'

@Component({
    selector: 'test-feed',
    templateUrl: './test-feed.html'
})
export class TestFeed implements OnInit {
    @Input() fia
    feed
    feedsRef: firebase.database.Reference = firebase.database().ref('feeds')

    constructor(private zone: NgZone) {}

    ngOnInit() {
        console.log("fia: ", this.fia)
        
        this.feedsRef.child(this.fia).on('value', (snap) => {
            this.feed = snap.val()
            this.zone.run(() => {
                this.feed
            })
            
            // console.log(this.feed)
        })
    }

}
