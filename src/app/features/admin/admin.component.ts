import { Component } from '@angular/core';

type AdminTool = 'scanner' | 'add-event';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  activeTool: AdminTool = 'scanner';

  setTool(tool: AdminTool): void {
    this.activeTool = tool;
  }
}
