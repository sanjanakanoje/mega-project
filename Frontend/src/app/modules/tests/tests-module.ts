import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestsRoutingModule } from './tests-routing-module';

// ✅ import standalone component
import { CreateTestRequestComponent } from './pages/create-test-request/create-test-request';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    TestsRoutingModule,

    CreateTestRequestComponent
  ]
})
export class TestsModule {}