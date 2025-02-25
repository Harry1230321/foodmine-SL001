import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../shared/models/Cart';
import { CartItem } from '../shared/models/CartItems';
import { Food } from '../shared/models/food';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart;
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(new Cart());

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.cart = this.getCartFromLocalStorage();
    this.cartSubject.next(this.cart);
  }

  addToCart(food: Food): void {
    let cartItem = this.cart.items.find(item => item.food.id === food.id);
    if (cartItem) return;
    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
  }

  removeFromCart(foodId: string): void {
    this.cart.items = this.cart.items.filter(item => item.food.id !== foodId);
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.items.find(item => item.food.id === foodId);
    if (!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setCartToLocalStorage();
  }

  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  private setCartToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cart.totalPrice = this.cart.items.reduce((prev, curr) => prev + curr.price, 0);
      this.cart.totalCount = this.cart.items.reduce((prev, curr) => prev + curr.quantity, 0);

      localStorage.setItem('Cart', JSON.stringify(this.cart));
    }
    this.cartSubject.next(this.cart);
  }

  private getCartFromLocalStorage(): Cart {
    if (isPlatformBrowser(this.platformId)) {
      const cartJson = localStorage.getItem('Cart');
      return cartJson ? JSON.parse(cartJson) : new Cart();
    }
    return new Cart();
  }
}
