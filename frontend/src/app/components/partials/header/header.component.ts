import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  
  cartQuantity = 0;
  user!: User;
  
  constructor(cartService: CartService, private userService: UserService) { 
    cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    });

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  ngOnInit() {
  } 

  logout() {
    this.userService.logout();
  }

  get isAuth() {
    return Boolean(this.user && this.user.token && this.user.token.length > 0);
  }
}