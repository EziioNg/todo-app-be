import { Injectable } from '@nestjs/common';
import { ProductDto } from 'src/modules/products/dto/product.dto';
import { Product } from 'src/models/product.model';

@Injectable()
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      categoryId: 1,
      productName: 'product1',
      price: 99,
    },
    {
      id: 2,
      categoryId: 1,
      productName: 'product2',
      price: 999,
    },
    {
      id: 3,
      categoryId: 1,
      productName: 'product3',
      price: 9999,
    },
  ];

  // getAllProduct(): string {
  //   return 'This return all products';
  // }
  getAllProduct(): Product[] {
    return this.products;
  }

  getDetails(id: number): Product {
    const product = this.products.find((p) => p.id === Number(id));
    console.log('product found: ', product);

    if (!product) {
      throw new Error('product not found');
    }

    return product;
  }

  createProduct(productDto: ProductDto): Product {
    const product: Product = {
      id: Math.random(),
      ...productDto,
    };
    this.products.push(product);
    console.log('product created: ', product);
    return product;
  }

  updateProduct(productDto: ProductDto, id: number): Product {
    const index = this.products.findIndex((p) => p.id === Number(id));

    const updatedProduct = this.products[index];
    updatedProduct.categoryId = productDto.categoryId;
    updatedProduct.productName = productDto.productName;
    updatedProduct.price = productDto.price;

    console.log('product updated: ', updatedProduct);
    return this.products[index];
  }

  deleteProduct(id: number): boolean {
    const index = this.products.findIndex((p) => p.id === Number(id));

    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1);
      console.log('deleted product: ', deletedProduct);
      return true;
    }
    return false;
  }
}
