/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { setTimeout } from "node:timers/promises";
import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
@Injectable()
export class AppService {
  async runAuto(username: string, password: string) {
    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
      browser = await puppeteer.launch({ headless: false });
      page = await browser.newPage();
      // const timeout = 15000;
      // page.setDefaultTimeout(timeout);

      await page.goto('https://www.tiktok.com/login/phone-or-email/phone-password', { waitUntil: 'networkidle2' });

      // Chờ và nhập thông tin đăng nhập
      await page.waitForSelector('input[name="mobile"]', { visible: true });
      await page.type('input[name="mobile"]', username, { delay: 100 });
      await setTimeout(3000),
        await page.type('input[type="password"]', password, { delay: 100 });

      // Nhấn nút đăng nhập
      await Promise.all([
        await setTimeout(3000),
        page.click('button[type="submit"]'),
        // page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ]);

      // Kiểm tra xem đã đăng nhập thành công chưa
      // const content = await page.content();
      // console.log(content)
      await page.waitForNavigation(); // wait for page to load
      await page.goto("https://www.tiktok.com/upload?lang=en"); // go to upload page
      // return content.includes('tên người dùng hoặc mật khẩu không đúng') ? 'Đăng nhập không thành công' : 'Đăng nhập thành công';
    } catch (error) {
      console.error('Error during login:', error);
      // return 'Đăng nhập không thành công do lỗi';
    } finally {
      if (browser) {
        // await browser.close();
      }
    }
  }
}
