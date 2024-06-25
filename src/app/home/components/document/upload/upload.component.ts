import { Component } from '@angular/core';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html'
})
export class UploadComponent {
  selectedFile: File | null = null;
  formData : any[] = [];
  name : string = '';
  tipo : string = '';
  size : number =0;
  constructor(private documentService: DocumentService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    this.name = this.selectedFile.name;
    this.tipo = this.selectedFile.type;
    this.size = this.selectedFile.size;
    console.log(this.selectedFile);
  }

  onUpload(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      console.log('File content as ArrayBuffer:',reader);
      reader.readAsArrayBuffer(this.selectedFile);

      reader.onload = () => {
        const fileData = reader.result as ArrayBuffer; // Obtiene los datos binarios del archivo como ArrayBuffer
        console.log('File content',fileData);

        if (fileData) {
          const extension = this.tipo.split('/').pop();
          const formData = {
            filename: this.name ,
            tipo: this.tipo,
            size: this.size,
            fileData: this.arrayBufferToBase64(fileData)
          };

          this.documentService.uploadDocument(formData).subscribe(response => {
            console.log('Document uploaded successfully', response);
          }, error => {
            console.error('Error uploading document', error);
          });
        }
      };
    }
  }
  
  // Función para convertir ArrayBuffer a base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }
}
