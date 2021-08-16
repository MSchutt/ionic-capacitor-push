import {Component, OnInit} from '@angular/core';
import {PushService} from '../services/push.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  token: string;
  greeting: string;

  constructor(private pushService: PushService) {}

  registerPush() {
    // This can also be moved to another component (should be called as soon as the app loads)
    this.pushService.registerActionPerformedHandler();
    this.pushService.registerPush();
  }

  ngOnInit(): void {
    // Warning! Never do this in production as it will cause a memory leak
    this.pushService.token.asObservable().subscribe(t => this.token = t);
    this.pushService.greeting.asObservable().subscribe(greeting => this.greeting = greeting);
  }
}
