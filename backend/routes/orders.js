const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* GET all orders */
router.get('/', function(req, res) {
  database.table('orders_details as od').join([
    {
      table:'orders as o',
      on:'o.id = od.order_id'
    },
    {
      table: 'products as p',
      on:'p.id = od.product_id'
    },
    {
      table: 'users as u',
      on:'u.id = o.user_id'
    }
  ]).withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username']).sort({id:1}).getAll().then(orders =>{
    if (orders.length > 0){
      res.status(200).json(orders);
    }else {
      res.json({message: 'No orders found'})
    }
  }).catch(err => console.log(err));
});

//GET a single order
router.get('/:id', (req, res) =>{
  const orderId = req.params.id

  database.table('orders_details as od').join([
    {
      table:'orders as o',
      on:'o.id = od.order_id'
    },
    {
      table: 'products as p',
      on:'p.id = od.product_id'
    },
    {
      table: 'users as u',
      on:'u.id = o.user_id'
    }
  ]).withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username']).filter({'o.id':orderId}).getAll().then(orders =>{
    if (orders.length > 0){
      res.status(200).json(orders);
    }else {
      res.json({message: `No orders found with ID: ${orderId}`})
    }
  }).catch(err => console.log(err));
});

//Place a new order
router.post('/new', (req, res) => {
  let {userId, products} = req.body;
  //console.log(userId, products);

  if (userId !== null && userId > 0 && !isNaN(userId)){
    database.table('orders').insert({
      user_id: userId
    }).then(newOrderId =>{
      if (newOrderId > 0){
        products.forEach(async (p)=>{
          let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();
          let inCart = p.incart;

          //Calculate how many of the item remains after the order
          if (data.quantity > 0){
            data.quantity = data.quantity - inCart;

            if (data.quantity < 0){
              data.quantity = 0;
            }
          }else {
            data.quantity = 0;
          }

          //Record the order details of the new order
          database.table('orders_details').insert({
            order_id: newOrderId,
            product_id: p.id,
            quantity: inCart
          }).then(newId =>{
            database.table('products').filter({id: p.id}).update({quantity: data.quantity})
                .then(success =>{}).catch(err => console.log(err))
          }).catch(err => console.log(err));
        });
      }else {
        res.json({message: 'Failed to add order details', success: false})
      }

      res.json({
        message: `Order ${newOrderId} placed successfully`,
        success: true,
        order_id: newOrderId,
        products: products
      })

    }).catch(err => console.log(err));
  }else {
    res.json({message: 'New order failed', success: false});
  }
});

//Fake payment gateway
router.post('/payment', (req, res) => {
  setTimeout(()=>{res.status(200).json({success: true})}, 3000);
})

module.exports = router;
