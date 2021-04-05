import {ProductModelServer} from "./product.model";

//frontend Angular server
export interface CartModelServer{
  total: number;
  data: [{
    product: ProductModelServer,
    numInCart: number,
  }];
}

//reference for local storage - for data sent to the client-side
export interface CartModelPublic{
  total: number;
  prodData: [{
    id: number,
    inCart: number
  }];
}
