import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

// Import your components
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { OrderLayoutComponent } from './layouts/order-layout/order-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: CreateOrderComponent }, 
    ],
  },
  {
    path: 'chleb/zamowienia',
    component: OrderLayoutComponent,
    children: [
      { path: '', component: OrderSummaryComponent, canActivate: [AuthGuard] },
    ],
  },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Przekierowanie na ''
];


// Provide routes in your app
export const appRouter = provideRouter(routes);
