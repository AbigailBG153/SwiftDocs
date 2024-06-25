import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../../services/document.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  documents: any[] = [];
  users: any[] = [];
  selectedUser: string = '';
  sharedByMe: any[] = [];
  sharedWithMe: any[] = [];
  uploadby: string = '';
  constructor(private documentService: DocumentService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadDocuments();
    this.loadUsers();
    this.loadSharedWithMe();
  }

  loadDocuments(): void {
    this.documentService.getUserDocuments().subscribe(
      (response: any[]) => {
        this.documents = response;
        this.documents.forEach(doc => {
          doc.showShareSelect = false; // Inicialmente ocultamos el select de compartir
          doc.selectedUser = ''; // Inicializamos el usuario seleccionado para compartir
          
        });
      },
      error => {
        console.error('Error loading documents', error);
      }
    );
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response: any[]) => {
        this.users = response;
      },
      error => {
        console.error('Error loading users', error);
      }
    );
  }

  viewDocument(documentId: string): void {
    this.documentService.getDataDocument(documentId).subscribe(
      (response: any) => {
        const blob = this.base64ToBlob(response.base64Data, response.mimeType);
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error => {
        console.error('Error fetching document', error);
      }
    );
  }

  shareDocument(documentId: string, userIdToShareWith: string): void {
    this.documentService.shareDocument(documentId, userIdToShareWith).subscribe(
      (response: any) => {
        console.log('Document shared successfully', response);
        this.loadDocuments(); 
        
      },
      error => {
        console.error('Error sharing document', error);
      }
    );
  }

  toggleShareSelect(document: any): void {
    // Toggle para mostrar u ocultar el select de compartir
    document.showShareSelect = !document.showShareSelect;
  }

  private base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }


  loadSharedWithMe(): void {
    this.documentService.getDocumentsSharedWithUser().subscribe(
      (response: any[]) => {
        this.sharedWithMe = response;
  
        console.log('Documentos compartidos conmigo:', this.sharedWithMe);
      },
      error => {
        console.error('Error al cargar documentos compartidos conmigo', error);
      }
    );
  }
  
}
