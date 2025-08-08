import Connexion from "../data/Connexion"
import { v4 } from "uuid"



const flavors =  [
                    { flavor: 'PIRÃO', ingredients: 'Salada, Calabresa, Carne de Sol e Camarão', price: 'R$ 35,00', max_quantity: 10}, 
                    { flavor: 'PIRÃO DE AIPIM - SÓ CAMARÃO', ingredients: 'Pirão, Camarão e Salada Tamanho M', price: 'R$ 35,00', max_quantity: 10 }, 
                    { flavor: 'PIRÃO DE AIPIM - SÓ CAMARÃO', ingredients: 'Pirão, Camarão e Salada Tamanho G', price: 'R$ 47,00', max_quantity: 10 }, 
                    { flavor: 'PIRÃO MEDIO COM CAMARÃO', ingredients: 'Salada, Calabresa, Carne de sol e Camarão', price: 'R$ 25,00', max_quantity: 10 }
                ]

const insertFlavors = async()=>{
    const step = 1
    /* =========================ATENÇÃO============================================== */
    const product_id = '337f0b67-a902-40ac-9a20-073b0a34c679' /* ATENÇÃO MÁXIMA AQUI */
    /* =========================MUITA ATENÇÃO========================================== */
    const subtitle = 'Sabores Pirão'
    try{
        const data = flavors.map(f =>   ({
            id: v4(),
            flavor: f.flavor,
            price: f.price.replace(/\D/g, ''),
            /* ingredients: f.ingredients, */
            max_quantity: f.max_quantity,
            total: 0,
            step,
            quantity: 0,
            subtitle,
            product_id
        }))
        await Connexion.con('flavors').insert(data)
        console.log(`${data.length} sabores inseridos com sucesso`)
    }catch(e){
        console.log(`Erro ao inserir sabores: ${e}`)
    }finally{
        await Connexion.con.destroy()
        console.log('Conexão encerrada')
    }
}



insertFlavors()

