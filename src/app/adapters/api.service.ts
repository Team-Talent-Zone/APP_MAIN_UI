import { Injectable} from '@angular/core';
import { config } from '../appconstants/config';


declare const google: any;
//const GOOGLE_MAPS_API_KEY = 'AIzaSyCaKbVhcX_22R_pRKDYuNA7vox-PtGaDkI';
export type Maps = typeof google.maps;

@Injectable()
export class ApiService {

  public readonly api = this.load();
  

  private async load(): Promise<Maps> {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    // tslint:disable-next-line:no-bitwise
    const callbackName = `GooglePlaces_cb_` + ((Math.random() * 1e9) >>> 0);
    script.src = this.getScriptSrc(callbackName);

    // tslint:disable-next-line: ban-types
    interface MyWindow { [name: string]: Function; }
    const myWindow: MyWindow = window as any;

    const promise = new Promise((resolve, reject) => {
      myWindow[callbackName] = resolve;
      script.onerror = reject;
    });
    document.body.appendChild(script);
    await promise;
    return google.maps;
  }

  private getScriptSrc(callback: string): string {
    interface QueryParams { [key: string]: string; }
    const query: QueryParams = {
      v: '3',
      callback,
      key: config.GOOGLE_MAPS_API_KEY,
      libraries: 'places',
    };
    const params = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    return `//maps.googleapis.com/maps/api/js?${params}&language=fr`;
  }

}
