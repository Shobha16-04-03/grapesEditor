import { Routes } from '@angular/router';
import { ComponentsComponent } from './components/components.component';
import { DemoProjectTestComponent } from './demo-project-test/demo-project-test.component';

export const routes: Routes = [
    {path:'',component:ComponentsComponent},
    {path:'grapes-demo',component:ComponentsComponent},
    {path:'demo-test',component:DemoProjectTestComponent}
];
