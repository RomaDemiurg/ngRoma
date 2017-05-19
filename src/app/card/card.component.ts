import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/last'
// import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/concat'
import 'rxjs/add/operator/mergeAll'
import 'rxjs/add/operator/concatAll'
import 'rxjs/add/operator/delay'


@Component({
    selector: 'app-card',
    templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
    last
    last_feed
    FEED_DETAIL = []
    arr = []
    last_arr = []

    // private prepareFeedForComparison(feed) {
    //     return feed.NAME.toLowerCase().trim()
    // }

    // private filterFeedsByName(feeds, name) {
    //     return feeds.filter(feed => this.prepareFeedForComparison(feed) == name)
    // }

    // private deleteFeed(key) {
    //     this.FEED_DETAIL.remove(key)
    //     // this.afdb.object('FEED_DETAIL/' + key).remove()
    // }

    // private nextPage() {

    //     // this.FEED_DETAIL.map(feeds => {
    //     //     this.last = feeds[feeds.length - 1].$key
    //     // })

    //     // setTimeout(() => {
    //     //     this.last = this.FEED_DETAIL.map( feeds => feeds[feeds.length-1].$key )
    //     // }, 3000)

    //     this.FEED_DETAIL = this.afdb.list('FEED_DETAIL', {
    //         query: {
    //             orderByKey: true,
    //             startAt: this.last_arr[this.last_arr.length-1],
    //             limitToFirst: 2
    //         }
    //     })
    //         .map(feeds => {
    //             let key = feeds[feeds.length - 1].$key

    //             if (this.last_arr.indexOf(key) == -1) {
    //                 this.last_arr.push(key)
    //             }

    //             return feeds
    //         })
    //         .map(feeds => {
    //             return feeds.filter(feed => feed.$key != this.last_arr[this.last_arr.length-1])
    //         })


    //     this.arr.push(this.FEED_DETAIL)
    //     // console.log(this.arr[0])


    //     // this.FEED_DETAIL = Observable.merge(this.FEED_DETAIL)


    //     // this.FEED_DETAIL = Observable
    //     //     .interval(3000)
    //     //     .merge(this.FEED_DETAIL1, this.FEED_DETAIL2)

    //     // this.FEED_DETAIL = this.FEED_DETAIL.merge(this.FEED_DETAIL2)
    //     // .map(feeds => this.filterFeedsByName(feeds, 'vova'))

    //     // this.last = this.FEED_DETAIL.last( last => console.log(last) )
    //     // this.last = this.FEED_DETAIL.map( feeds => feeds[feeds.length-1].$key )
    // }

    constructor(private afdb: AngularFireDatabase) {
        // this.FEED_DETAIL = this.afdb.list('FEED_DETAIL', {
        //     query: {
        //         orderByKey: true,
        //         startAt: this.last,
        //         limitToFirst: 3
        //     }
        // })

        this.afdb.list('FEED_DETAIL', { query: { limitToLast: 1 } })
            .map(list => {
                if (list.length > 0) {
                    this.last_feed = list
                    console.log('last_feed:', this.last_feed)
                }
            })
            .subscribe(val => console.log(val))


        // .subscribe(list => {
        //     if (list.length > 0) {
        //         this.last_feed = list
        //         console.log('last_feed:', this.last_feed)
        //     }
        // })
    }

    ngOnInit() { }

    nextPage() {
        this.afdb.list('FEED_DETAIL', {
            query: {
                orderByKey: true,
                startAt: this.last,
                limitToFirst: 3
            }
        })
        .subscribe(list => {

            list.forEach(item => {

                const feed = this.findFeedByKey(item)

                if (feed) {
                    console.log('feed found:', feed)
                } else {
                    this.FEED_DETAIL.push(item)
                    console.log('feed pushed:', feed)
                }


                // if (this.FEED_DETAIL.length > 0) {
                //     for (var i = 0; i < this.FEED_DETAIL.length; i++) {
                //         var feed = this.FEED_DETAIL[i]

                //         if (feed.$key == item.$key) {
                //             this.FEED_DETAIL[i] = item
                //         }

                //     }
                // } else {
                //     this.FEED_DETAIL.push(item)
                //     console.log('not finded:', item.$key)
                // }



                // if (this.FEED_DETAIL.indexOf(item.$key) == -1) {
                //     this.FEED_DETAIL.push(item)
                //     console.log('not finded:', item.$key)
                // } else {
                //     console.log('exists:', item.$key)
                // }

                // for (var key in object) {
                //     if (object.hasOwnProperty(key)) {
                //         var element = object[key];

                //     }
                // }


                // this.FEED_DETAIL.forEach(feed => {
                //     console.log('inside')
                //     if (item.$key in feed) {
                //         console.log('exists:', item.$key)
                //     } else {
                //         this.FEED_DETAIL.push(item)
                //         console.log('not finded:', item.$key)
                //     }
                // })

            })

            this.last = this.FEED_DETAIL[this.FEED_DETAIL.length - 1].$key

            console.log('feed detail:', this.FEED_DETAIL, 'last:', this.last)

        })
    }

    findFeedByKey(feed) {
        let feedFound = null

        if (!this.FEED_DETAIL) {
            return feedFound
        }

        for (let i = 0; i < this.FEED_DETAIL.length; i++) {
            const currentFeed = this.FEED_DETAIL[i]

            if (currentFeed.$key === feed.$key) {
                this.FEED_DETAIL[i] = feed
                feedFound = currentFeed
                break
            }
        }

        return feedFound
    }

}
