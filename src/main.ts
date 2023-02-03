import App from './App.svelte'
import "./app.css"
import "./assets/ticatec-dashboard.css"
import 'ticatec-ts-enchance-utils/EnArray'
import 'tsui-summary-table/tsui-summary-table.css'
import "ticatec-app-framework/Toast";

declare global {
  interface Array<T> {
    combine(list: Array<T>, matchFun: (o1:any, o2: any) => boolean): void;
  }
}

if (!Array.prototype.combine) {
  Array.prototype.combine = function (list: Array<any>, matchFun: (element:any, item: any) => boolean): void {
    list.forEach(item =>
    {
      const idx = this.findIndex(element => matchFun(element, item));
      if (idx==-1) {
        this.push(item);
      } else {
        this.splice(idx, 1, item);
      }
    });
  }
}

import './bare.css'
import './mdc.typography.css'
import './app.css'

const app = new App({
  target: document.body
})



export default app
