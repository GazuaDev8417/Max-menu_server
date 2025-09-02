export interface ProductModel{
    id:string
    product:string
    descrition:string
    category:string
    price:number
    quantity:number
    total:number
}

export interface FlavorModel{
    id:string		
    flavor:string		
    price:number		
    ingredients:string	
    max_quantity:number
    total:number		
    product_id:string
    step:number		
    quantity:number
    subtitle:string
}

export interface ClientModel{
    id:string
    client:string
    street:string
    neighborhood:string
    cep:string
    phone:string
    obs:string
    pedido:number
    moment:number
}

export interface UserModel{
    id:string
    user:string
    phone:string
    password:string
    role:string
    street:string
    cep:string
    neighbourhood:string
    complement:string
}

export interface CartModel{
    id:string	
    price:number			
    quantity:number
    flavor:string	
    total:number			
    product_id:string	
    client:string 	
    max_quantity:number 
    step:number 
}

export interface ProductCartModel{
    id:string
    product:string
    price:number
    quantity:number
    total:number
    client:string
    product_id:string
    category:string
}

export interface GroupedProduct{
    product:ProductCartModel
    items:FlavorModel[]
}

export interface GroupedClientOrders{
    client:ClientModel,
    orders:GroupedProduct[]
}

export interface Order {
  id: string
  pedido: string
  moment: string | Date
}

