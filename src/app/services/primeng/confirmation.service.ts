import { Injectable } from '@angular/core';
import { Confirmation, ConfirmationService as ParentService } from 'primeng/api';

@Injectable()
export class ConfirmationService extends ParentService {
    override confirm(confirmation: Confirmation): this {
        let defaultConfirmation = {
            message: "¿Are you sure?",
            icon: "fas fa-circle-info text-primary",
            acceptLabel: "Yes",
            rejectLabel: "No",
            acceptButtonStyleClass: "border-0 bg-success",
            rejectButtonStyleClass: "border-0 bg-danger",
            defaultFocus: "accept"
        };

        return super.confirm({ ...defaultConfirmation, ...confirmation });
    }

    confirmDelete(confirmation: Confirmation) {
        let defaultConfirmation = {
            message: "¿Are you sure?",
            icon: "fas fa-triangle-exclamation text-danger",
            acceptLabel: "Delete",
            rejectLabel: "Cancel",
            acceptButtonStyleClass: "border-0 bg-danger",
            rejectButtonStyleClass: "border-0 bg-primary",
            defaultFocus: "reject"
        };

        return super.confirm({ ...defaultConfirmation, ...confirmation });
    }
}
