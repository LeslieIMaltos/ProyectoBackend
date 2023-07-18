import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductFormDataDto } from './dto/product.dto';
import { generatePDF } from './helpers/pdfCompra';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  //Categorias
  @Get('/categorias')
  findCategorias() {
    return this.ventasService.getAll();
  }

  //Productos
  @Get('/productos')
  findAllProducts() {
    return this.ventasService.getAllProducts();
  }

  @Get('/productos/xcategoria/:id')
  findProductsByCategory(@Param('id') id: number) {
    return this.ventasService.getAllProductsByCategory(id);
  }

  @Get('/productos/xcategoriaxVendedor/:id/:idVendedor')
  findProductsByCategoryByVendedor(
    @Param('id') id: number,
    @Param('idVendedor') idVendedor: string,
  ) {
    return this.ventasService.getAllProductsByCategoryByVendedor(
      id,
      idVendedor,
    );
  }

  @Post('/productos')
  @UseInterceptors(FileInterceptor('file'))
  createProduct(
    @Body() producto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ventasService.create(producto, file);
  }

  @Patch('/productos/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateProduct(
    @Param('id') id: number,
    @Body() producto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ventasService.update(id, producto, file);
  }

  @Delete('/productos/:id')
  remove(@Param('id') id: number) {
    return this.ventasService.delete(id);
  }

  //carrito
  @Post('/agregarCarrito')
  AgregarCarrito(
    @Body() carritoCompras: any,
  ) {
    return this.ventasService.agregarAlCarrito(carritoCompras);
  }

  @Get('/verCarrito/:id')
  getCarritoxUsuario(
    @Param('id') id: string,
  ) {
    return this.ventasService.getCarritoxUsuario(id);
  }
  @Patch('/carrito/:id')
  ActualizaarCarrito(
    @Param('id') id: number,
    @Body() carrito:any
  ) {
    return this.ventasService.actualizarCarrito(id, carrito);
  }

  @Delete('/carrito/:id')
  eliminarDelCarrito(@Param('id') id: number) {
    return this.ventasService.eliminarCarrito(id);
  }

  @Post('/compra/')
  realizarCompra(@Body() compras:any) {
    return this.ventasService.ComprarProducto(compras);
  }
  // @Get('/pdf')
  // async getPDF(@Res() res: Response): Promise<void> {
  //   const buffer = await generatePDF();

  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'attachment; filename=example.pdf',
  //     'Content-Length': buffer.length,
  //   });

  //   res.end(buffer);
  // }
}
