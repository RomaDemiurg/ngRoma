import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'like',
    templateUrl: './like.component.html'
})
export class LikeComponent implements OnInit {
    @Input() feed_id: number
    like_array: Array<number> = [2, 6, 4, 67, 16, 96, 74, 8, 12]
    like: number

    constructor() { }

    ngOnInit() {
        this.like = this.like_array[ this.feed_id ]
    }

    likeFeed() {
        this.like_array[this.feed_id] += 1
        this.like = this.like_array[ this.feed_id ]
    }

}
