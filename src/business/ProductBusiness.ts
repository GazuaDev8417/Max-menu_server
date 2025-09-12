import { Request } from "express"
import ProductData from "../data/ProductData"
import { ProductModel, ProductCartModel, FlavorModel } from "../model/InterfacesAndTypes"
import Authentication from "../services/Authentication"




export default class ProductBusiness{
    constructor(
        private productData:ProductData
    ){}
    

    getCartByClient = async(req:Request):Promise<ProductCartModel[]>=>{
        const token = req.headers.authorization
        const userId = new Authentication().tokenData(token as string).userId

        const products = await this.productData.getCartByClient(userId)

        return products
    } 


    getProductById = async(req:Request):Promise<ProductModel>=>{
        const product = await this.productData.getProductById(req.params.id)
        
        if(!product){
            throw{
                statusCode: 404,
                error: new Error('Produto não encontrado')
            }
        }

        return product
    }

    flavorsByProduct = async(req:Request):Promise<{flavors: FlavorModel[], maxStep: number, total_quantity:number }>=>{
        /* const token = req.headers.authorization
        const client = new Authentication().tokenData(token as string).userId */
        const { step } = req.body
        const objectFlavors = await this.productData.flavorsByProduct(req.params.id, step/* , client */)
        const flavors = objectFlavors.flavors
        const maxStep = objectFlavors.maxStep
        const total_quantity = objectFlavors.total_quantity

        if(flavors.length === 0){
            throw{
                statusCode: 404,
                error: new Error('Nenhum sabor ainda foi adicionado para esse produto')
            }
        }

        return {
            flavors,
            maxStep: Number(maxStep) || 0,
            total_quantity: Number(total_quantity)
        }
    }


    updateProductQntFromCart = async(req:Request):Promise<void>=>{
        const { quantity } = req.body
        const id = req.params.id
        const product = await this.productData.getProductCartById(id)

        if(!product){
            throw{
                statusCode: 404,
                error: new Error('Erro ao buscar sabor')
            }
        }

        await this.productData.updateProductQntFromCart(id, quantity, product)
    }  
    

    verifyMaxQnt = async(req:Request):Promise<{ maxStep:number, total_quantity:number }>=>{
        const client = (await new Authentication().authToken(req)).id
        const objectFlavors = await this.productData.verifyMaxQnt(req.params.id, client)
        const maxStep = objectFlavors.maxStep
        const total_quantity = objectFlavors.total_quantity


        return {
            maxStep: Number(maxStep) || 0,
            total_quantity: Number(total_quantity)
        }
    } 


    getAllProducts = async():Promise<ProductModel[]>=>{
        const products = await this.productData.getAllProducts()

        if(products.length === 0){
            throw{
                statusCode: 404,
                error: new Error('Lista de produtos vazia!')
            }
        }

        return products
    }


    deleteOrder = async(req:Request):Promise<void>=>{
        const { userId, productId } = req.body
        await this.productData.deleteOrder(userId, productId)
    }
}