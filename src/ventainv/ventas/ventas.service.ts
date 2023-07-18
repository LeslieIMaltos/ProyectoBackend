import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { productos } from './entities/producto.entity';
import { categories } from './entities/categoria.entity';
import { ProductFormDataDto, productDto } from './dto/product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { carrito_compras } from './entities/carritoCompras.entity';
import { carritoDto } from './dto/carrito.dto';
import { ventas } from './entities/ventas.entity';
import { compras } from './entities/compras.entity';
import { generatePDF } from './helpers/pdfCompra';
// import * as PDFDocument from 'pdfkit';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(productos)
    private productRepository: Repository<productos>,
    @InjectRepository(categories)
    private categoriesRepository: Repository<categories>,
    @InjectRepository(carrito_compras)
    private carritoComprasRepository: Repository<carrito_compras>,
    @InjectRepository(ventas)
    private ventasRepository: Repository<ventas>,
    @InjectRepository(compras)
    private comprasRepository: Repository<compras>,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  //Categorias
  async getAll() {
    return await this.categoriesRepository.find();
  }

  //Productos
  async getAllProducts() {
    const results = { ok: true, message: 'Productos', results: [] };
    const products = await this.productRepository.find({
      where: { status: true },
    });
    if (!products) return { ok: false, message: 'No hay productos' };
    results.results = products;
    return results;
  }

  async getAllProductsByCategory(id: number) {
    const results = {
      ok: true,
      message: 'Productos Por Categoria',
      results: [],
    };
    const products = await this.productRepository.find({
      where: { idCategoria: id, status: true },
    });
    if (!products) return { ok: false, message: 'No hay productos' };
    results.results = products;
    return results;
  }

  async getAllProductsByCategoryByVendedor(id: number, idVendedor: string) {
    const results = {
      ok: true,
      message: 'Productos Por Categoria',
      results: [],
    };
    const products = await this.productRepository.find({
      where: { idCategoria: id, idVendedor, status: true },
    });
    if (!products) return { ok: false, message: 'No hay productos' };
    results.results = products;
    return results;
  }

  async create(producto: ProductFormDataDto, file?: Express.Multer.File) {
    const productParse: productDto = JSON.parse(producto.producto);
    try {
      productParse.status = true;
      const newProduct = this.productRepository.create(productParse);
      await this.uploadImageToCloudinary(file).then((image) => {
        newProduct.imagenProducto = image.url;
      });
      await this.productRepository.save(newProduct);
      return { ok: true, message: 'Producto creado', results: newProduct };
    } catch (error) {
      throw new BadRequestException('Error al crear el producto');
    }
  }

  async update(
    id: number,
    producto: ProductFormDataDto,
    file?: Express.Multer.File,
  ) {
    const productParse: productDto = JSON.parse(producto.producto);
    try {
      const updateP = await this.productRepository.update(
        { idProductos: id },
        productParse,
      );
      if (!updateP)
        return {
          ok: false,
          message: 'El producto no se ha actualizado correctamente',
        };
      const product = await this.productRepository.findOne({
        where: { idProductos: id },
      });
      if (!product) return { ok: false, message: 'El producto no existe' };
      if (file) {
        await this.uploadImageToCloudinary(file).then((image) => {
          product.imagenProducto = image.url;
          this.productRepository.save(product);
        });
      }
      return { ok: true, message: 'Producto actualizado', results: product };
    } catch (error) {
      throw new BadRequestException('Error al actualizar el producto');
    }
  }

  async delete(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { idProductos: id },
      });
      if (!product) return { ok: false, message: 'El producto no existe' };
      const updateP = await this.productRepository.update(id, {
        status: false,
      });
      if (!updateP)
        return {
          ok: false,
          message: 'El producto no se ha actualizado correctamente',
        };
      return { ok: true, message: 'Producto eliminado' };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el producto');
    }
  }
  async agregarAlCarrito(carritoCompras: any) {
    let newProduct = {};
    const carritoParse: carritoDto = carritoCompras;
    try {
      const producto = await this.productRepository.findOne({
        where: { idProductos: carritoParse.idProducto, status: true },
      });
      if (producto) {
        const existe = await this.carritoComprasRepository.findOne({
          where: {
            idUsuario: carritoParse.idUsuario,
            idProducto: carritoParse.idProducto,
            status: true,
          },
        });
        if (existe) {
          if (
            producto.cantidadStock >=
            (carritoParse.cantidad + existe.cantidad)
          ) {
            carritoParse.cantidad += existe.cantidad;
            carritoParse.precioUnitario = producto.precio;
            carritoParse.precioTotal = producto.precio * carritoParse.cantidad;
            await this.carritoComprasRepository.update(
              { idCarrito: existe.idCarrito },
              {
                cantidad: carritoParse.cantidad,
                precioTotal: carritoParse.precioTotal,
                precioUnitario: carritoParse.precioUnitario,
              },
            );
          } else {
            return {
              ok: false,
              message:
                'El producto no cuenta con suficientes en stock para guardarlos en el carrito.',
            };
          }
        } else {
          if (producto.cantidadStock >= carritoParse.cantidad) {
            carritoParse.precioTotal = producto.precio * carritoParse.cantidad;
            carritoParse.precioUnitario = producto.precio;
            carritoParse.disponible = true;
            carritoParse.status = true;
            newProduct = this.carritoComprasRepository.create(carritoParse);
          } else {
            return {
              ok: false,
              message:
                'El producto no cuenta con suficientes en stock para guardarlos en el carrito.',
            };
          }
        }
      } else {
        return {
          ok: false,
          message: 'El producto no se encuentra disponible',
        };
      }
      const result = await this.carritoComprasRepository.save(newProduct);
      return {
        ok: true,
        message: 'Producto agregado al carrito',
        results: result,
      };
    } catch (error) {
      throw new BadRequestException('Error al agregar al carrito ' + error);
    }
  }

  async getCarritoxUsuario(id: string) {
    const carrito = await this.carritoComprasRepository.find({
      where: { idUsuario: id, status: true },
    });
    let results = [];
    if (!carrito)
      return { ok: false, message: 'No hay productos en el carrito' };
    for (const element of carrito) {
      const product = await this.productRepository.findOne({
        where: { idProductos: element.idProducto },
      });
      let aux = {
        idCarrito: element.idCarrito,
        idProductos: product.idProductos,
        nombreProducto: product.nombreProducto,
        descripcionProducto: product.descripcionProducto,
        cantidad: element.cantidad,
        precioTotal: element.precioTotal,
        precioUnitario: element.precioUnitario,
        idCategoria: product.idCategoria,
        categoria: product.idCategoria,
        idVendedor: product.idVendedor,
        nombreVendedor: product.nombreVendedor,
        imagenProducto: product.imagenProducto,
        disponible: element.disponible,
      };
      results.push(aux);
    }
    return {
      ok: true,
      message: 'Productos Por Categoria',
      results,
    };
  }

  async actualizarCarrito(id: number, updatecarrito: any) {
    const carrito = await this.carritoComprasRepository.find({
      where: { idCarrito: id },
    });

    if (!carrito)
      return { ok: false, message: 'No existe dicho producto en el carrito' };

    //checar el stock del producto y si supera el limite mandar un mensaje
    const producto = await this.productRepository.findOne({
      where: { idProductos: carrito[0].idProducto },
    });
    if (producto.cantidadStock < updatecarrito.cantidad)
      return {
        ok: false,
        message: `Stock Del Producto: ${producto.cantidadStock},
        Cantidad Solicitada: ${updatecarrito.cantidad} No hay suficiente stock para actualizar`,
      };

    await this.carritoComprasRepository.update(
      { idCarrito: id },
      {
        cantidad: updatecarrito.cantidad,
        precioTotal: updatecarrito.precioTotal,
        precioUnitario: updatecarrito.precioUnitario,
      },
    );

    return {
      ok: true,
      message: 'Se ha actualizado el Carrito con éxito!',
    };
  }

  async eliminarCarrito(id: number) {
    const carrito = await this.carritoComprasRepository.find({
      where: { idCarrito: id },
    });
    if (!carrito)
      return { ok: false, message: 'No existe dicho producto en el carrito' };
    const updateP = await this.carritoComprasRepository.update(
      { idCarrito: id },
      {
        status: false,
      },
    );
    return {
      ok: true,
      message: 'Se ha eliminado el producto del Carrito con éxito!',
    };
  }

  async ComprarProducto(compras: any) {
    let productosPDF=[]
    for(const element of compras.productos){
      const producto = await this.productRepository.findOne({where:{
        idProductos:element.idProducto
      }});
      if (!producto) return { ok: false, message: 'No existe dicho producto' };
      if (producto.cantidadStock < element.cantidad) return { ok: false, message: 'La Cantidad a comprar es mayor a la cantidad en stock disponible' };
      const compra = await this.comprasRepository.create({
       idUsuario:compras.idUsuario,
       idProducto:producto.idProductos,
       nombreProducto:producto.nombreProducto,
       precioUnitario:producto.precio,
       precioTotal:producto.precio * element.cantidad,
       cantidad:element.cantidad
      });
      await this.comprasRepository.save(compra);
      const venta = await this.ventasRepository.create({
        idVendedor:producto.idVendedor,
        idProducto:producto.idProductos,
        nombreProducto:producto.nombreProducto,
        precio:producto.precio,
        cantidadVendido:element.cantidad
       });
       await this.ventasRepository.save(venta);
      producto.cantidadStock -= element.cantidad;
      await this.productRepository.save(producto);
      const carrito = await this.carritoComprasRepository.findOne({
        where: { idUsuario: compras.idUsuario, idProducto:element.idProducto, status:true},
      });
      if(carrito){
        if(carrito.cantidad < element.cantidad){
          carrito.cantidad = element.cantidad-carrito.cantidad;
          carrito.status = false;
        }else if(carrito.cantidad > element.cantidad){
          carrito.cantidad -= element.cantidad
        }else{
          carrito.cantidad = 0
          carrito.status = false;
        }
        if(producto.cantidadStock == 0){
          carrito.disponible = false;
        }
        await this.carritoComprasRepository.save(carrito);
      }
      productosPDF.push({
        nombreProducto:producto.nombreProducto,
        cantidad: element.cantidad,
        precio:producto.precio
      })
    }
    const results = await generatePDF(productosPDF, compras.pago);
    return {
      ok: true,
      message: 'Se ha generado la compra!',
      results,
    };
  }
  // async generatePDF(): Promise<Buffer> {
  //   const pdfBuffer: Buffer = await new Promise((resolve) => {
  //     const doc = new PDFDocument({
  //       size: 'LETTER',
  //       bufferPages: true,
  //     });

  //     // customize your PDF document
  //     doc.text('hello world', 100, 50);
  //     doc.end();

  //     const buffer = [];
  //     doc.on('data', buffer.push.bind(buffer));
  //     doc.on('end', () => {
  //       const data = Buffer.concat(buffer);
  //       resolve(data);
  //     });
  //   });

  //   return pdfBuffer;
  // }
}
