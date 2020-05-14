import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, desktopCapturer , screen } from 'electron';
import * as childProcess from 'child_process';
import * as psList  from 'ps-list';
import * as fs from 'fs';
import  * as usb  from 'usb';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  desktopCapturer: typeof desktopCapturer;
  remote: typeof remote;
  childProcess: typeof childProcess;
  psList: typeof psList;
  fs: typeof fs;
  usb: typeof usb;
  screen: typeof screen;
  
  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.desktopCapturer = window.require('electron').desktopCapturer;
      

      this.childProcess = window.require('child_process');

      this.psList = window.require('ps-list');
      this.fs = window.require('fs');
      this.usb = window.require('usb');
    }
  }
}
