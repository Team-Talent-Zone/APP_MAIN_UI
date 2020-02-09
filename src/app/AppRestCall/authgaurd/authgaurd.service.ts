import { UserService } from '../user/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthgaurdService  implements CanActivate {

  constructor(private router: Router,
              private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (this.userService.currentUserValue) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
        }
}
}
