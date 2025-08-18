import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../core/models/user.model';

export interface DeleteConfirmationData {
  user: User;
  title?: string;
  message?: string;
}

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.scss']
})
export class DeleteConfirmationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmationData
  ) {}

  get title(): string {
    return this.data.title || 'Confirmar Exclusão';
  }

  get message(): string {
    return this.data.message || `Tem certeza que deseja excluir o usuário "${this.data.user.name}"?`;
  }

  get userName(): string {
    return this.data.user.name;
  }

  get userEmail(): string {
    return this.data.user.email;
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
