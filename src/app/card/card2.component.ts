import { Component } from '@angular/core'
import '../../configs/firebase'

@Component({
    selector: 'card2',
    templateUrl: './card2.component.html'
})
export class Card2Component {
    FEED_DETAIL = []
    TEST_VALUE_EVENT
    KEYS
    feedsRef: firebase.database.Reference
    feedsQuery: firebase.database.Query
    feedsQuery2: firebase.database.Query

    incrementCounter(key, count) {
        this.feedsRef.child(key).update({count: count + 1})
        // this.TEST_VALUE_EVENT[i]['count'] = count
    }

    constructor() {
        // this.TEST_VALUE_EVENT = [
        //     { count: 0, text: 'test 1' },
        //     { count: 0, text: 'test 2' }
        // ]

        this.feedsRef = firebase.database().ref('FEED_DETAIL/TEST_VALUE_EVENT')
        this.feedsRef.on('value', snap => {
            let values = snap.val()
            this.KEYS = Object.keys(values)

            this.TEST_VALUE_EVENT = snap.val()
        }
        
        // {         
        //     let values = snap.val()

        //     let keys = Object.keys(values)
        //     keys.forEach((key) => {
        //         let text = values[key].text
        //         let count = values[key].count
        //         this.TEST_VALUE_EVENT[key] = { key, text, count }
        //     })

        // }
        
        )
        
        
        // this.feedsQuery = this.feedsRef.orderByKey().startAt('-KbRz8fpW7NwGQiQGP2m').limitToFirst(5)

        // this.feedsQuery.on('child_added', (snapshot) => {
        //     // console.log(snapshot.val())
        //     this.feedAdded(snapshot.key, snapshot.val().NAME, snapshot.val().AVATAR)
        // })

        // this.feedsQuery.on('child_changed', (snapshot) => {
        //     // console.log('snapshot_changed', snapshot.key, snapshot.val().NAME)
        //     this.feedChanged(snapshot.key, snapshot.val().NAME)
        // })

        // this.feedsQuery.on('child_removed', (snapshot) => {
        //     // console.log(snapshot.val())
        //     this.feedRemoved(snapshot.key)
        // })
    }

    private feedAdded(key, NAME, AVATAR) {
        this.FEED_DETAIL.push({ key, NAME, AVATAR })
        console.log('feedAdded()', key, this.FEED_DETAIL)
    }

    private feedValue(values) {
        
        let keys = Object.keys(values)
        if (this.FEED_DETAIL.length > 0) {
            keys.splice(0, 1)
        }
        
        keys.forEach((key) => {
            let NAME = values[key].NAME
            let AVATAR = values[key].AVATAR
            this.FEED_DETAIL.push({ key, NAME, AVATAR })
        })
        
        console.log('feedValue()', this.FEED_DETAIL)
    }

    private feedChanged(key, name) {
        for (var i = 0; i < this.FEED_DETAIL.length; i++) {
            if (this.FEED_DETAIL[i].key == key) {
                this.FEED_DETAIL[i].NAME = name
                console.log('feedChanged()', this.FEED_DETAIL)
            }
        }
    }

    private feedRemoved(key) {
        for (var i = 0; i < this.FEED_DETAIL.length; i++) {
            if (this.FEED_DETAIL[i].key == key) {
                this.FEED_DETAIL.splice(i, 1)
                console.log('feedRemoved()', this.FEED_DETAIL)
            }
        }
    }

    private removeFeed(key) {
        this.feedsRef.child(key).remove()
    }

    private createFeed() {
        this.feedsRef.push({AVATAR: 'assets/images/avatar2.jpg', NAME: 'Leila'})
    }

    private nextPage() {
        this.feedsQuery2 = this.feedsRef.orderByKey().startAt(this.lastFeed()).limitToFirst(5)

        this.feedsQuery2.once('value', (snapshot) => {
            this.feedValue(snapshot.val())
        })

        this.feedsQuery2.on('child_changed', (snapshot) => {
            this.feedChanged(snapshot.key, snapshot.val().NAME)
        })

        this.feedsQuery2.on('child_removed', (snapshot) => {
            this.feedRemoved(snapshot.key)
        })
    }

    private lastFeed() {
        if (this.FEED_DETAIL.length == 0) {
            return '-KbRz8fpW7NwGQiQGP2m'
        } else {
            return this.FEED_DETAIL[this.FEED_DETAIL.length-1].key
        }
    }
}
