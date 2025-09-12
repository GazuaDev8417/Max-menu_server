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

/* =============PROUCT ROUTES===================== */
app.post('/flavors/:id', productCntroller.flavorsByProduct)

app.patch('/cart/product/:id', productCntroller.updateProductQntFromCart)

app.get('/step-qnt_max/:id', productCntroller.verifyMaxQnt)
app.get('/product/:id', productCntroller.getProductById)
app.get('/products/', productCntroller.getAllProducts)
app.get('/products/cart', productCntroller.getCartByClient)

app.delete('/orders', productCntroller.deleteOrder)
/* ==================CART ROUTES========================= */
app.post('/insert_in_cart', cartController.insertInCart)
app.post('/pay', cartController.pay)

app.patch('/update_qnt/', cartController.updateFlavorQntFromCart)

app.get('/cart/product/:id', cartController.cartProductById)
app.get('/payment-status/:id', cartController.paymentStatus)
app.get('/products/flavors/:id', cartController.productsOnOrderByClient)
app.get('/products/flavors', cartController.productsOnOrder)
/* ===================CLIENT ROUTES=================== */
app.post('/user/signup', clientController.registUser)
app.post('/user/login', clientController.loginUser)

app.patch('/user/address', clientController.updateAddress)
app.patch('/user', clientController.updateClientData)

app.get('/user', clientController.userById)
app.get('/client/:id', clientController.clientById)
app.get('/clients/orders', clientController.productsOnOrderByClients)

app.delete('/del-user', clientController.deleteAccount)
