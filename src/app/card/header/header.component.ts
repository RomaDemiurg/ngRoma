import { Component, Input } from '@angular/core';

@Component({
    selector: 'card-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    @Input() feed

    constructor() { }

}
