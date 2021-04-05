import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "./product.service";
import {OrderService} from "./order.service";
import {CartModelPublic, CartModelServer} from "../models/cart.model";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {ProductModelServer} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private url = "http://localhost:3000/api";

  //variable to store cart info on the client's local storage
  private cartDataClient: CartModelPublic = {
    total:0,
    prodData: [{
      inCart: 0,
      id: 0
    }]
  };

  //Variable to store cart info on the Angular frontend server
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined
    }]
  };

  //Observables for the components to subscribe
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(private http:HttpClient,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router) {

    //next() is similar to emit()
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    //get data from local storage (if any) - this will allow data persistence for the cart
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    //check if info variable contains data or is null
    if (info !== null && info !== undefined && info.prodData[0].inCart !== 0){
      //Local storage contains data; replace initial cart data with this info
      this.cartDataClient = info;

      //loop through and place each element in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) =>{
          if (this.cartDataServer.data[0].numInCart === 0){
            this.cartDataServer.data[0].numInCart = p.inCart;
            this.cartDataServer.data[0].product = actualProductInfo;

            //TODO Create  CalculateTotal fucntion

            this.cartDataClient.total = this.cartDataServer.total
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }else {
            //cartDataServer already has data in it
            this.cartDataServer.data.push({
              numInCart: p.inCart,
              product: actualProductInfo
            });
            //TODO Create  CalculateTotal fucntion

            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            /*All of this is done to ensure the localstorage and the server data are synced*/
          }

          this.cartData$.next({...this.cartDataServer});
        });
      });
    }

  }
}
