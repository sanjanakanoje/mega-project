import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  generateBarcode(): string {
    const date = new Date();

    const yyyy = date.getFullYear();
    const mm = ('0' + (date.getMonth() + 1)).slice(-2);
    const dd = ('0' + date.getDate()).slice(-2);

    const random = Math.floor(1000 + Math.random() * 9000);

    return `SMP-${yyyy}${mm}${dd}-${random}`;
  }
}