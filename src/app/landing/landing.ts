import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Footer } from "../footer/footer";
import { Header } from '../header/header';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Footer, Header],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
