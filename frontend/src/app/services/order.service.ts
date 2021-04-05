import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = "http://localhost:3000/api";
  private products: ProductResponseModel[] = [];

  constructor(private http: HttpClient) { }

  getSingleOrder(orderId: number){
    return this.http.get<ProductResponseModel[]>(this.url + '/orders/' + orderId).toPromise();
  }

}


interface ProductResponseModel{
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
