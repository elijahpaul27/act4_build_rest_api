import express, { Request, Response,Router } from 'express';
import { Product, UnitProduct } from './product.interface';
import * as database from './products.database';
import { StatusCodes } from 'http-status-codes';

export const productRouter = express.Router();

productRouter.get('/products', async (req: Request, res: Response): Promise<any> => {
    try {
        const allProducts = await database.findAll();
        if (allProducts.length === 0)
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'No Products found' });

        return res.status(StatusCodes.OK).json({ total: allProducts.length, allProducts });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error});
    }
});

productRouter.get('/product/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const product = await database.findOne(req.params.id);

        if (!product)
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product does not exist' });

        return res.status(StatusCodes.OK).json({ product });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error});
    }
});

productRouter.post('/product', async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, price, quantity, image } = req.body;

        if (!name || !price || !quantity || !image) 
            return res.status(StatusCodes.BAD_REQUEST).json({ error: `Please provide all the required parameters..` });

        const newProduct = await database.create({...req.body});
        return res.status(StatusCodes.CREATED).json({ newProduct });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error});
    }
});

productRouter.put('/product/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const newProductData = req.body;

        const findProduct = await database.findOne(id);

        if (!findProduct)
            return res.status(StatusCodes.NOT_FOUND).json({ error: `Product does not exist..` });

        const updatedProduct = await database.update(id, newProductData);
        return res.status(StatusCodes.OK).json({ updatedProduct });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error});
    }
});

productRouter.delete('/product/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const product = await database.findOne(req.params.id);

        if (!product)
            return res.status(StatusCodes.NOT_FOUND).json({ error: `No Product with ID ${req.params.id}` });

        await database.remove(req.params.id);
        return res.status(StatusCodes.OK).json({ msg: `Product deleted..` });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error});
    }
});