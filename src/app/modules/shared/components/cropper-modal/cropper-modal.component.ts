import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first, Observable, Subject } from 'rxjs';
import Cropper from 'cropperjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cropper-modal',
  templateUrl: './cropper-modal.component.html',
  styleUrls: ['./cropper-modal.component.scss']
})
export class CropperModalComponent implements OnInit {

  @ViewChild('cropperImg') cropperImg!: ElementRef<HTMLImageElement>
  cropper!: Cropper;

  // Path to img or base64. Passed in initParams
  srcImg!: SafeUrl;
  aspectRatio?: number;
  rounded?: boolean;

  // base64 of the cropped img
  resultImg: Subject<HTMLCanvasElement | null>;
  $resultImg: Observable<HTMLCanvasElement | null>;


  constructor(public bsModalRef: BsModalRef,
  ) {
    this.resultImg = new Subject();
    this.$resultImg = this.resultImg.asObservable().pipe(
      first(),
    )
    this.bsModalRef.onHide?.subscribe(() => this.resultImg.next(null));
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.cropper = new Cropper(this.cropperImg.nativeElement, {
      aspectRatio: this.aspectRatio,
      viewMode: 1 // Prevents going outside of the canvas
    });
  }

  saveImage() {
    this.resultImg.next(this.cropper.getCroppedCanvas());
    this.bsModalRef.hide();
  }
}
