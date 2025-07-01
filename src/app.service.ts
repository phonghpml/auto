import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
@Injectable()
export class AppService {
  async runAuto() {
    // Or import puppeteer from 'puppeteer-core';

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  }
}
