import { Component, OnInit, Input } from '@angular/core';


@Component({
    selector: 'card-image',
    templateUrl: './card-image.component.html',
    styleUrls: ['./card-image.component.css']
})
export class CardImageComponent implements OnInit {
    @Input() feed

    constructor() { }

    ngOnInit() { }

}
