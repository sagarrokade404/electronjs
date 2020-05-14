import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainServService {

  bits = new BehaviorSubject<any>(0)

  bitsObserver = this.bits.asObservable()

  constructor() { }

   formatFileSize(bytes,decimalPoint) {

    return new Promise ( (resolve, reject) => {
      if(bytes == 0) return '0 Bytes';
      var k = 1000,
          dm = decimalPoint || 2,
          sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
      console.log('size change',parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i])
      resolve(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i])
    })

    


 }

 

}
