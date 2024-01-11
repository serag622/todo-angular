import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-feather-icons",
  templateUrl: "./feather-icons.component.html",
  styleUrls: ["./feather-icons.component.sass"],
})
export class FeatherIconsComponent implements OnInit {
  @Input("icon") public icon !: string;
  @Input("class") public class !: string;
  constructor() {}

  ngOnInit(): void {}
}
