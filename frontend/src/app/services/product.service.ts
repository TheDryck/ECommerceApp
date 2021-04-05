import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductModelServer, ServerResponse} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = "http://localhost:3000/api"

  constructor(private http: HttpClient) { }

  /*Get products*/
  getAllProducts(resultsLimit:number = 10):Observable<ServerResponse>{
    return this.http.get<ServerResponse>(this.url + '/products', {
      params: {limit: resultsLimit.toString()}
    })
  }

  /*Get single product*/
  getSingleProduct(id: number): Observable<ProductModelServer>{
    return this.http.get<ProductModelServer>(this.url + '/products/' + id);
  }

  /*Get products from a single category*/
  getProductsFromCategory(catName: string): Observable<ProductModelServer[]>{
    return this.http.get<ProductModelServer[]>(this.url + '/products/category/' + catName);
  }

}
