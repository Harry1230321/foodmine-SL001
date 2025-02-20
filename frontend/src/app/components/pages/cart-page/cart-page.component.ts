import { Component, OnInit } from '@angular/core';
import { Cart } from '../../../shared/models/Cart';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../shared/models/CartItems';

@Component({
  selector: 'app-cart-page',
  standalone: false,
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {

    cart!: Cart;
    constructor(private cartService:CartService) { 
      this.cartService.getCartObservable().subscribe((cart)=>{
        this.cart = cart;
      })
    }
  
    ngOnInit(): void {
    }

    removeFromCart(cartItem:CartItem){
      this.cartService.removeFromCart(cartItem.food.id);
    }

    changeQuantity(cartItem:CartItem,quantityInString:string){
      const quantity =parseInt(quantityInString);
      this.cartService.changeQuantity(cartItem.food.id, quantity);
    }
}
