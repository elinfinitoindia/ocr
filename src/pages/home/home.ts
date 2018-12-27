import { Component } from '@angular/core';
import { NavController, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { NativeStorage } from '@ionic-native/native-storage';
import * as Tesseract from 'tesseract.js'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedImage:string;
  imageText:string;
  ncount:number;
  language:string = 'eng';
 
  constructor(public toss:ToastController,
    private ns:NativeStorage,
    private tts:TextToSpeech,
    private loading:LoadingController,
    public navCtrl: NavController,private actionsh:ActionSheetController,private camera:Camera) {

  
 
  this.ns.getItem('notecount').then(result=>{
    this.ncount = result.count;
  })
  .catch(_=>{
    this.ns.setItem('notecount',{
      count:0,
    })
  })
}

refresh(){
this.selectedImage = "";
this.imageText = "";
}

chooseImage(){
// let actionSheet = this.actionsh.create({
//   buttons: [
//     {
//       text: 'Library',
//       handler: () => {
//         this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
//       }
//     },
//     {
//       text: 'Capture Picture',
//       handler: () => {
//         this.getPicture(this.camera.PictureSourceType.CAMERA);
//       }
//     },
//     {
//       text: 'Cancel',
//       role: 'cancel',
//     }
//   ]
// });

// actionSheet.present();
this.getPicture(this.camera.PictureSourceType.CAMERA);
}

getPicture(source:PictureSourceType){
this.camera.getPicture({
  quality:100,
  destinationType:this.camera.DestinationType.DATA_URL,
  allowEdit:true,
  correctOrientation:true,
  sourceType:source,
  saveToPhotoAlbum:false,
}).then(imageData=>{
  this.selectedImage = `data:image/jpeg;base64,${imageData}`;
  this.recog();
})
.catch(reason=>{
  alert(reason);
})
}

speak(){
this.tts.speak(this.imageText)
.then(response=>{

})
.catch(error=>{
  alert(error)
})
}

recog(){
let lc = this.loading.create({
  content:'Recognizing...',
  spinner:'ios',
})
lc.present();
Tesseract.recognize(this.selectedImage, this.language)
.progress(result=>{
  if(result.status=='recognizing text'){
    // this.progress.set(result.progress);
  }
})
.catch(e=>{
  alert(e)
})
.then(result=>{
  this.imageText = result.text;
  console.log(this.imageText);
})
.finally(ress=>{
  // this.progress.complete();
  lc.dismiss();
})
}
}