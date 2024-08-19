
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ButtonComponent } from '../../components/button/button.component';
import { DataService } from '../../services/data/data.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ButtonComponent
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  providers: [DataService]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  expandedUserId: number | null = null;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  currentUser: User = {} as User;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.dataService.getUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error loading users:', error);
        alert('Failed to load users. Please try again.');
      }
    );
  }

  openAddModal() {
    this.modalMode = 'add';
    this.currentUser = {} as User;
    this.showModal = true;
  }

  openEditModal(user: User) {
    this.modalMode = 'edit';
    this.currentUser = { ...user };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveUser() {
    const operation = this.modalMode === 'add' 
      ? this.dataService.addUser(this.currentUser)
      : this.dataService.updateUser(this.currentUser);

    operation.subscribe(
      (response) => {
        alert(`User ${this.modalMode === 'add' ? 'added' : 'updated'} successfully`);
        this.loadUsers();
        this.closeModal();
      },
      (error) => {
        console.error(`Error ${this.modalMode === 'add' ? 'adding' : 'updating'} user:`, error);
        alert(`Failed to ${this.modalMode === 'add' ? 'add' : 'update'} user. Please try again.`);
      }
    );
  }

  deleteUser(userId: number) {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      this.dataService.deleteUser(userId).subscribe(
        () => {
          alert('User deleted successfully');
          this.loadUsers();
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again.');
        }
      );
    }
  }

  toggleUserDetails(userId: number) {
    this.expandedUserId = this.expandedUserId === userId ? null : userId;
  }
}

  

