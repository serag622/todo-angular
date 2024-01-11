import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeatherIconsModule } from "./components/feather-icons/feather-icons.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeatherIconsModule ,
    NgbModule ,
  ],
  exports: [
    FeatherIconsModule,
    NgbModule
  ],
})
export class SharedModule {}
