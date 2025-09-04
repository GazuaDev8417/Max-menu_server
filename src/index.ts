import { app } from "./app"
import ProductBusiness from "./business/ProductBusiness"
import ProductController from "./controllers/ProductController"
import ProductData from "./data/ProductData"

import CartBusiness from "./business/CartBusiness"
import CartData from "./data/CartData"
import CartController from "./controllers/CartController"

import ClientBusiness from "./business/ClientBusiness"
import ClientController from "./controllers/ClientController"
import ClientData from "./data/ClientData"



const productCntroller = new ProductController(
    new ProductBusiness(
        new ProductData
    )
)

const cartController = new CartController(
    new CartBusiness(
        new CartData,
        new ProductData
    )
)

const clientController = new ClientController(
    new ClientBusiness(
        new ClientData
    )
) 


app.post('/regist_products', productCntroller.registProducts)
app.post('/flavors/:id', productCntroller.flavorsByProduct)
app.post('/products/cart', productCntroller.insertInProductCart)

app.post('/insert_in_cart', cartController.insertInCart)
app.post('/cart_product', cartController.checkProductsFromCart)
app.post('/pay', cartController.pay)


//app.post('/regist/client', clientController.registClient)
app.post('/user/signup', clientController.registUser)
app.post('/user/login', clientController.loginUser)

app.patch('/user/address', clientController.updateAddress)
app.patch('/user', clientController.updateClientData)

//app.get('/generate-user-id', clientController.generateUserId)
app.get('/client/lastorder', clientController.clientLastOrder)
app.get('/user', clientController.userById)


app.get('/step-qnt_max/:id', productCntroller.verifyMaxQnt)
app.get('/product/:id', productCntroller.getProductById)
app.get('/products/', productCntroller.getAllProducts)
app.get('/products/cart', productCntroller.getCartByClient)


app.get('/clients/cart/', cartController.getCartFromClient)
app.get('/clients/orders', clientController.clientsWithOrders)

app.get('/cart/product/:id', cartController.cartProductById)

app.get('/products/flavors', cartController.productsOnOrder)


//app.get('/flavors_step2/:id', productCntroller.flavorsByProductStep2)


//app.patch('/flavor_quantity/:id', productCntroller.)
//app.patch('/flavor_quantitystep2/:id', productCntroller.updateFlavorsQntStep2)

app.patch('/cart/product/:id', productCntroller.updateProductQntFromCart)

app.patch('/update_qnt/', cartController.updateFlavorQntFromCart)

app.delete('/product_cart/:id', cartController.removeFlavorFromCart)
app.delete('/product/cart/:id', productCntroller.removeProductFromCart)
app.delete('/product/client', productCntroller.removeProductFromCartByClient)
app.delete('/client/order/:id', clientController.removeClientOrder)
app.delete('/del-user', clientController.deleteAccount)

