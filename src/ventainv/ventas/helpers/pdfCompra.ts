import * as PDFDocument from 'pdfkit'
import path from "path";
const fs = require("fs");

export const generatePDF = async (productos:any, pago: number) => {
    const pdfBuffer: Buffer = await new Promise(resolve => {
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream("PDFCOMPRA.pdf"));
      let precio = 0
      doc.font("Helvetica-Bold").fontSize(22).text('RECIBO DE COMPRA', 175, 40);
      doc
      .moveTo(10, 70)
      .lineTo(600, 70)
      .stroke();
      let xTitulo = 50, xTexto = 150, y=80;
      doc.font("Helvetica-Bold").fontSize(13).text('PRODUCTOS:', xTitulo-20, y);
      doc.font("Helvetica-Bold").fontSize(13).text('PRECIO TOTAL:', xTitulo+370, y);
      y+=20;      
      productos.forEach(element => {
        doc
      .moveTo(10, y)
      .lineTo(600, y)
      .stroke();
      y+=15;
        doc.font("Helvetica-Bold").fontSize(12).text('PRODUCTO:', xTitulo, y);
        if(element.nombreProducto.length>26){
            element.nombreProducto = element.nombreProducto.substring(0, 26) + "...";
        }
        doc.font("Helvetica").fontSize(12).text(element.nombreProducto, xTexto, y);
        y+=15;
        doc.font("Helvetica-Bold").fontSize(12).text('CANTIDAD:', xTitulo, y);
        doc.font("Helvetica").fontSize(12).text(element.cantidad, xTexto, y);
        doc.font("Helvetica-Bold").fontSize(12).text('CANTIDAD:', xTitulo, y);
        y+=15;
        doc.font("Helvetica-Bold").fontSize(12).text('PRECIO C/U:', xTitulo, y);
        doc.font("Helvetica").fontSize(12).text("$" + element.precio, xTexto, y);
        doc.font("Helvetica").fontSize(12).text("$"+ String(element.precio*element.cantidad), xTitulo+380, y);
        precio +=element.precio*element.cantidad;
        y+=15;
      });
      y+=5;
      doc
      .moveTo(10, y)
      .lineTo(600, y)
      .stroke();
      y+=10;
      doc.font("Helvetica").fontSize(12).text("IVA(0.16%)", xTitulo+380, y);
      y+=15;
      if(pago==1){
       doc.font("Helvetica-Bold").fontSize(12).text('TOTAL PAGADO:', xTitulo+260, y); 
      }else{
        doc.font("Helvetica-Bold").fontSize(12).text('TOTAL POR PAGAR:', xTitulo+260, y);
      }
      let precioTotal = precio*1.15;
      precioTotal= Number(precioTotal.toFixed(2))
      doc.font("Helvetica").fontSize(12).text("$"+ String(precioTotal), xTitulo+380, y);
      y+=30;
        doc.font("Helvetica-Bold").fontSize(16).text('GRACIAS POR TU COMPRA!', 175, y);
      doc.end()

      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
    })
    return pdfBuffer
  }