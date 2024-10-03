import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxGrapesjsModule } from 'ngx-grapesjs';

@Component({
  selector: 'app-demo-project-test',
  standalone: true,
  imports: [RouterLink,NgxGrapesjsModule],
  templateUrl: './demo-project-test.component.html',
  styleUrl: './demo-project-test.component.css'
})
export class DemoProjectTestComponent {

}
