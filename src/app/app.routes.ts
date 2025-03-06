import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

// Import your components
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';

export const routes: Routes = [
  { path: '', redirectTo: 'chleb/formularz', pathMatch: 'full' }, // Default route
  { path: 'chleb/formularz', component: CreateOrderComponent },
  { path: 'chleb/zamowienia', component: OrderSummaryComponent, canActivate: [AuthGuard] },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: '**', redirectTo: 'chleb/formularz', pathMatch: 'full' },
];

// Provide routes in your app
export const appRouter = provideRouter(routes);
