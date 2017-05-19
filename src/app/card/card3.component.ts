import { Component, /*NgZone*/ } from '@angular/core'
import { Http } from '@angular/http'
import { Headers, RequestOptions } from '@angular/http'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/delay'
import '../../configs/firebase.js'


class Feed {
    kind: string
    key: string
    value: {
        id: string
        likes: number
        media: string
        title: string
    }

    constructor(
        kind = 'Feeds',
        key = 'feed4',
        value = {
            id: '-KjKzAj76amplCjBAvD7',
            likes: 8,
            media: 'feed4/image_01.jpg',
            title: 'Lamborghini'
        }
    ) {
        this.kind = kind
        this.key = key
        this.value = value
    }
}

/*interface Feed {
    key: string
    likes: number
    text: string
    comments?: any
}*/

@Component({
    selector: 'app-card-3',
    templateUrl: './card3.component.html'
})
export class Card3Component {
    // getAllFeeds
    startAtFeedKey
    lastFeedKey
    feedKeys
    comments = {}
    allowNextPageRequest = true
    feeds = []
    fire
    /* feedsRef: firebase.database.Reference = firebase.database().ref('FEED_DETAIL/TEST_VALUE_EVENT')*/

    feedsRef: firebase.database.Reference = firebase.database().ref('feeds')
    commentsRef: firebase.database.Reference = firebase.database().ref('comments')
    datastoreRef = 'https://us-central1-ngfire1-92729.cloudfunctions.net/'
    // feed_id_array
    url = this.datastoreRef + 'createFeed'
    feed: Feed = new Feed

    createUserUrl = this.datastoreRef + 'createUser'
    user = {
        email: 'roma2@prots2.com',
        emailVerified: false,
        password: 'secretPassword2',
        displayName: 'Roma Doe',
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false
    }
    currentUser

    // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

    login() {
        const currentUser = firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password)
        currentUser.then((user) => {
            this.currentUser = user
        })
    }

    createUser() {
        const headers = new Headers({ 'Content-Type': 'application/json' })
        const options = new RequestOptions({ headers: headers })
        this.http.post(this.createUserUrl, this.user, options)
        .subscribe(
            (res) => {
                console.log(res.text())
                // const body = res
                // return body.data || {}
            },
            (err) => {
                console.log(err._body)
            }
        )
    }

    createFeed() {
        const headers = new Headers({ 'Content-Type': 'application/json' })
        const options = new RequestOptions({ headers: headers })
        this.http.post(this.url, this.feed, options).subscribe(res => {
            console.log(res.text())
            // const body = res
            // return body.data || {}
        })
    }

    constructor(private http: Http, /*private zone: NgZone*/) {

        // this.feeds = http.get(this.datastoreRef + 'getFeeds').map(res => res.json())

        /*http.get(this.datastoreRef + 'getFeeds')
            .map(res => {
                return res.json()
            })
            .subscribe(feeds => {
                feeds.forEach(feed => this.feeds.push(feed))

                console.log('getFeeds', this.feeds)
            })*/

        /*this.feeds = http.get(this.datastoreRef + 'getFeeds')
            .map((res) => {
                return res.json()
                // console.log(this.feeds)

                // this.feed_id_array = "-KjKu8ITdyUNfxT4i7Ez"

                // this.feedsRef.child(this.feed_id_array).on('value', (snap) => {
                //     this.feed = snap.val()
                //     this.zone.run(() => {
                //         this.feed
                //     })

                //     // console.log(this.feed)
                // })

                // this.getAllFeeds.forEach(feed => {
                //     feed_id_array.push(feed.id)
                // })

                // this.feedsRef.child(feed_id_array[0]).on('value', (snap) => {
                //     this.feed_ = snap.val()
                //     console.log(this.feed_)
                // })

                // console.log(this.feed_id_array)
            })

        this.getFirstFeedKey()
        this.getLastFeedKey()*/
    }

    /*private addComment(feedKey) {
        const comment = { author: 'Roma', text: 'Comment ', img: 'img/01.jpg', likes: 4 }
        this.commentsRef.child(feedKey).push(comment)
    }

    private addFeed() {
        const feed = { author: 'Roma', text: 'Some text ', img: 'img/01.jpg', likes: 4 }
        this.feedsRef.push(feed)
    }*/

    private getComments(feedKey) {
        this.commentsRef.child(feedKey).orderByKey().startAt(this.lastComment(feedKey)).limitToFirst(5).once('value', (snap) => {
            if (snap.exists()) {
                const comments = snap.val()
                const keys = Object.keys(comments).sort()

                for (let i = 0; i < this.feeds.length; i++) {
                    if (this.feeds[i].key === feedKey) {

                        keys.forEach(key => {
                            const likes = comments[key].likes
                            const text = comments[key].text

                            this.feeds[i]['comments'].push({ key, likes, text })
                        })

                        console.log('getComments()', this.feeds)
                    }
                }

                /*this.comments[feedKey] = []

                keys.forEach(key => {
                    let likes = comments[key].likes
                    let text = comments[key].text

                    this.comments[feedKey].push({ key, likes, text })
                })*/
            }
        })
    }

    private getFeeds() {
        if (this.lastFeedKey !== this.startAtFeedKey && this.allowNextPageRequest) {
            this.allowNextPageRequest = false
            return this.feedsRef.orderByKey().startAt(this.startAtFeedKey).limitToFirst(5).once('value', (snap) => {
                const feeds = snap.val()
                this.feedKeys = Object.keys(feeds).sort()
                this.startAtFeedKey = this.feedKeys[this.feedKeys.length - 1]

                this.feedKeys.forEach(key => {
                    const likes = feeds[key].likes
                    const text = feeds[key].text
                    const comments = []

                    this.feeds.push({ key, likes, text, comments: comments })
                    this.getComments(key)
                })


                // this.feedKeys.forEach(feedKey => this.getComments(feedKey) )

                this.allowNextPageRequest = true
            })
        }
    }

    private lastComment(feedKey) {
        if (this.comments[feedKey] && this.comments[feedKey].length > 0) {
            const comments = this.comments[feedKey]
            const lastKey = comments[comments.length - 1].key
            console.log('lastkey: ', lastKey)
            return lastKey
        } else {
            // console.log("0")
            return '0'
        }
    }

    /*private lastFeed() {
        if (this.feeds.length > 0) {

            let currentKey = this.feeds[this.feeds.length - 1].key

            console.log('currentKey', currentKey)
            console.log("lastFeedKey", this.lastFeedKey)

            if (this.lastFeedKey == currentKey) {
                // this.hasFeeds = false
            }

            return currentKey
        } else {
            // console.log("0")
            return '0'
        }
    }*/

    /*private getLastFeedKey() {
        return this.feedsRef.orderByKey().limitToLast(1).once('value', (snap) => {
            this.lastFeedKey = Object.keys(snap.val())[0]
        })
    }

    private getFirstFeedKey() {
        return this.feedsRef.orderByKey().limitToFirst(1).once('value', (snap) => {
            this.startAtFeedKey = Object.keys(snap.val())[0]
        })
    }*/
}
