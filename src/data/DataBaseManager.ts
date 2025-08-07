import Connexion from "./Connexion"




export default class DatabaseManager extends Connexion{
    static PRODUCT_TABLE = 'products'
    static PRODUCTCART_TABLE = 'products_cart'
    static FLAVORS_TABLE = 'flavors'
    static CART_TABLE = 'cart'
    static ADMUSER_TABLE = 'admuser'
    static CLIENTS_TABLE = 'clients'



    public static async createProductTable():Promise<void>{
        try{
            const exists = await this.con.schema.hasTable(this.PRODUCT_TABLE)
            if(!exists){
                await this.con.schema.createTable(this.PRODUCT_TABLE, (table)=>{
                    table.string('id', 36).primary().notNullable()
                    table.string('product', 50).notNullable()                  
                    table.decimal('price', 10, 2).notNullable()
                    table.integer('quantity').notNullable()
                    table.decimal('total', 10, 2).notNullable()
                    table.string('description', 255)
                    table.string('category', 20)
                    table.string('image', 20)
                })
                console.log(`Tabela ${this.PRODUCT_TABLE} criada com sucesso`)
            }else{
                console.log(`Tabela ${this.PRODUCT_TABLE} já existe`)
            }
        }catch(e){
            console.log(`Erro ao criar tabela ${this.PRODUCT_TABLE}: ${e}`)
        }
    }


    public static async createFlavorsTable():Promise<void>{
        try{
            const exists = await this.con.schema.hasTable(this.FLAVORS_TABLE)
            if(!exists){
                await this.con.schema.createTable(this.FLAVORS_TABLE, (table)=>{
                    table.string('id', 36).primary().notNullable()
                    table.string('flavor', 50).notNullable()                  
                    table.decimal('price', 10, 2)                  
                    table.string('ingredients', 255)
                    table.integer('max_quantity').notNullable()
                    table.decimal('total', 10, 2)
                    table.string('product_id', 36).notNullable()
                    table.integer('quantity').notNullable()
                    table.string('subtitle', 39)
                })
                console.log(`Tabela ${this.FLAVORS_TABLE} criada com sucesso`)
            }else{
                console.log(`Tabela ${this.FLAVORS_TABLE} já existe`)
            }
        }catch(e){
            console.log(`Erro ao criar table ${this.FLAVORS_TABLE}: ${e}`)
        }
    }


    public static async createCartTable():Promise<void>{
        try{
            const exists = await this.con.schema.hasTable(this.CART_TABLE)
            if(!exists){
                await this.con.schema.createTable(this.CART_TABLE, (table)=>{
                    table.string('id', 36).primary().notNullable()
                    table.decimal('price', 10, 2)                  
                    table.integer('quantity')
                    table.string('flavor', 50) 
                    table.decimal('total', 10, 2)
                    table.string('product_id', 36).notNullable()
                    table.string('client', 36).notNullable()
                    table.integer('max_quantity')
                    table.integer('step') 
                })
                console.log(`Tabela ${this.CART_TABLE} criada com sucesso`)
            }else{
                console.log(`Tabela ${this.CART_TABLE} já existe`)
            }
        }catch(e){
            console.log(`Erro ao criar table ${this.CART_TABLE}: ${e}`)
        }
    }

    public static async createClientstCartTable():Promise<void>{
        try{
            const exists = await this.con.schema.hasTable(this.CLIENTS_TABLE)
            if(!exists){
                await this.con.schema.createTable(this.CLIENTS_TABLE, (table)=>{
                    table.string('id', 36).primary().notNullable()
                    table.text('pedido').notNullable()                    
                    table.timestamp('moment', { useTz: true}).notNullable().defaultTo(this.con.fn.now())                 
                })
                console.log(`Tabela ${this.CLIENTS_TABLE} criada com sucesso`)
            }else{
                console.log(`Tabela ${this.CLIENTS_TABLE} já existe`)
            }
        }catch(e){
            console.log(`Erro ao criar table ${this.CLIENTS_TABLE}: ${e}`)
        }
    }

    public static async createProductCartTable():Promise<void>{
        try{
            const exists = await this.con.schema.hasTable(this.PRODUCTCART_TABLE)
            if(!exists){
                await this.con.schema.createTable(this.PRODUCTCART_TABLE, (table)=>{
                    table.string('id', 36).primary().notNullable()
                    table.string('product', 50).notNullable() 
                    table.decimal('price', 10, 2).notNullable()                  
                    table.integer('quantity').notNullable()    
                    table.decimal('total', 10, 2).notNullable()
                    table.string('client',36).notNullable()
                    table.string('product_id',36).notNullable()
                    table.string('category',20).notNullable()
                })
                console.log(`Tabela ${this.PRODUCTCART_TABLE} criada com sucesso`)
            }else{
                console.log(`Tabela ${this.PRODUCTCART_TABLE} já existe`)
            }
        }catch(e){
            console.log(`Erro ao criar table ${this.PRODUCTCART_TABLE}: ${e}`)
        }
    }

    public static async createAdmUserTable():Promise<void>{
        try{
            const exists = await this.con.schema.hasTable(this.ADMUSER_TABLE)
            if(!exists){
                await this.con.schema.createTable(this.ADMUSER_TABLE, (table)=>{
                    table.string('id', 36).primary().notNullable()
                    table.string('phone', 11).notNullable() 
                    table.string('password', 255).notNullable() 
                    table.string('role', 20).notNullable() 
                    table.string('user', 20).notNullable() 
                })
                console.log(`Tabela ${this.ADMUSER_TABLE} criada com sucesso`)
            }else{
                console.log(`Tabela ${this.ADMUSER_TABLE} já existe`)
            }
        }catch(e){
            console.log(`Erro ao criar table ${this.ADMUSER_TABLE}: ${e}`)
        }
    }


    public static async closeConnexion():Promise<void>{
        await this.con.destroy()
        console.log('Conexão com banco de dados encerrada')
    }
}


(async()=>{
    await DatabaseManager.createProductTable()
    await DatabaseManager.createFlavorsTable()
    await DatabaseManager.createCartTable()
    await DatabaseManager.createClientstCartTable()
    await DatabaseManager.createProductCartTable()
    await DatabaseManager.createAdmUserTable()
    await DatabaseManager.closeConnexion()
})()