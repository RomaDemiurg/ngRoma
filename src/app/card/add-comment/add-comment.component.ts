import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'add-comment',
    templateUrl: './add-comment.component.html',
    styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
    touched = false
    rows = 1

    constructor() { }

    ngOnInit() { }

    addComment() {
        this.touched = !this.touched
        this.touched ? this.rows = 4 : this.rows = 1
    }

}
