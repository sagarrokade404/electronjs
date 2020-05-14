import { Component, ViewChild, Renderer2, ElementRef, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import {MainServService } from './service/main-serv.service';
// import * as psList from 'ps-list';
import * as si from 'systeminformation';
import { exists } from 'fs';
import { async } from 'rxjs/internal/scheduler/async';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit , AfterViewChecked{
  @ViewChild('screens') public screens : ElementRef;
  @ViewChild('canvas', { static: true }) 
canvas: ElementRef<HTMLCanvasElement>;
changestateopen = false;
cpuopenexpand = false;
public doughnutChartLabels = ['Used', 'free'];
public doughnutChartData = [0, 0];
public doughnutChartType = 'doughnut';
displayadded = false;

  imageFormat = 'base64data' || 'image/jpeg';
  ctx;
  videoHeight = 500;
  videoWidth = 500;
  pslistdata: any;
  cpuData: any;
  memData: any;
  osInfoData: any;
  viwecpudata = false;
  totaldisplay: any;
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private renderer2: Renderer2, 
    private elementRef: ElementRef,
    private mainserv: MainServService,
  ) {



    translate.setDefaultLang('en');
    // console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      // console.log(process.env);
     
      electronService.childProcess.exec(`tasklist`, (err,stdout,stderr) => {
     
        if(stdout) {
          // console.log('err',stdout)
        }
      
      })
    } else {
      // console.log('Mode web');
    }


  }
  ngAfterViewChecked() {
  
  }
  changescreensmall() {
   
     
      this.electronService.ipcRenderer.send('resize-me-small'); 
    
  }
  changescreenlarge () {

  
    this.electronService.ipcRenderer.send('resize-me-please'); 
  }
  ngOnInit() {
 
    this.electronService.usb.on('attach', (device) => { 
      console.log('use elec data',device)
      alert('New USB device attached')
     });
     this.electronService.usb.on('detach', (device) => { 
      console.log('use elec detach',device)
      alert('USB device detached')
     });
  
     setTimeout(() => {
      this.getServicerunning()
      console.log('runing new server')
    }, 1000);
     setInterval(() => {
      this.getServicerunning()
      console.log('runing new server')
    }, 90000);
    
  //  this.electronService.usb.on( (data) => {
  //     console.log('usbdata',data);
  //   })
    this.electronService.desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      sources.forEach( (streamdata) => {
        if(streamdata.name === 'Snipping Tool') {
          // return false;
          alert('please close Snipping Tool')
        

        }else if (streamdata.name === 'VLC media player') {
          alert('please close VLC media player')
      
        }
      })
    })
  }
  takescreenshot() {

  
let cantakescreenshot = true;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.electronService.desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      // const streamVLC = sources.find( value => value.name === 'VLC media player');
      sources.forEach( (streamdata) => {
        if(streamdata.name === 'Snipping Tool') {
          // return false;
          alert('please close Snipping Tool')
          cantakescreenshot = false;

        }else if (streamdata.name === 'VLC media player') {
          alert('please close VLC media player')
          cantakescreenshot = false;
        }
      })
      // if(streamVLC) {
      //   alert('please close VLC media player first')
      //   return;
      // }

//  electron-packager . --platform=darwin  --overwrite
//    electron-packager . --platform=win32 --overwrite
  if(cantakescreenshot) {
    const stream = sources.find( value => value.name === 'Entire Screen');

    const videostream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: <any> {
          mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: stream.id,
              minWidth: 1280,
              maxWidth: 4000,
              minHeight: 720,
              maxHeight: 4000
          }
      }
  });
    // console.log('find stream',videostream);
        
      if(videostream) {
       let video = this.renderer2.createElement('video');
      //  
      this.renderer2.setStyle(video, 'position', 'absolute');
      // this.renderer2.setStyle(video, 'top', '-10000px');
      this.renderer2.setStyle(video, 'border', '2px solid red')
      this.renderer2.setProperty(video, 'srcObject', videostream);
      video.play();
      video.onloadedmetadata = () => {
    
  
  
        this.renderer2.setStyle(video, 'height', '900px')
        this.renderer2.setStyle(video, 'width', '900px');
  
  
        this.ctx.drawImage(video, 0, 0);
       const image =  this.canvas.nativeElement.toDataURL("image/png")
       let base64Image = image.split(';base64,').pop();
      //  this.electronService.fs
      this.electronService.fs.writeFile('newsaveiamgedata/savenewimage.png', base64Image, {encoding: 'base64'}, (err) => {
        setTimeout(() => {
      
          this.electronService.ipcRenderer.send('resize-me-please'); 
          this.changestateopen = true;
        }, 200);
        if (err) {
          console.error(err)
          return
        }else {
          console.log('File created');
        }
    });
     
       console.log(image)
        video.remove();
        videostream.getTracks()[0].stop();
   
        // let ptag = this.renderer2.createElement('p')
        // const text = this.renderer2.createText('Hello world!');
        // this.renderer2.appendChild(ptag, text);
    // this.renderer2.appendChild(this.screens.nativeElement, ptag);
      // this.renderer2.appendChild(this.screens.nativeElement, video)
      }
  
      
      }
  }
    });
  }


 public async getServicerunning() {
   this.cpuopenexpand = true;
    console.log('getServicerunning');
    // this.electronService.usb.on('attach', (device) => { 
    //   console.log('use elec attach',device)
    //  });
    //  this.electronService.usb.on('detach', (device) => { 
    //   console.log('use elec detach',device)
    //  });
  
    const cpu = await  si.cpu();
    const mem = await si.mem()
    const osInfo = await si.osInfo();
const graphics = await si.graphics()
 const filesize = await    this.mainserv.formatFileSize(mem.total,2);
 const free = await    this.mainserv.formatFileSize(mem.free,2);
 const used = await    this.mainserv.formatFileSize(mem.used,2);
 
    this.memData =  {
      total : filesize,
      totalbit: mem.total,
      free: free,
      freebits: mem.free,
      used: used,
      userbits: mem.used
    };
    this.cpuData = cpu;
    this.osInfoData = osInfo;
    this.viwecpudata = true;
    this.totaldisplay = graphics.displays;
    console.log('graphics',graphics.displays)
    // console.log('this.cpuData',this.cpuData)
    // console.log('this.memData',this.memData)
    // console.log('this.osInfoData',this.osInfoData);

    this.doughnutChartData = [mem.used, mem.free]

  }
  


}


