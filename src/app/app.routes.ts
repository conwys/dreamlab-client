import { Routes } from '@angular/router';
import { RoomUploaderComponent } from './features/room-uploader/room-uploader.component';
import { HomePageComponent } from './features/home-page/home-page.component';
import { EditRoomComponent } from './features/edit-room/edit-room.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'plan', component: RoomUploaderComponent },
  { path: 'edit', component: EditRoomComponent },
];
