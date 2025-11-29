/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { setTimeout } from "node:timers/promises";
import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
const fs = require('fs');
puppeteer.use(StealthPlugin());
@Injectable()
export class AppService {
  async runAuto(username: string, password: string) {
    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
      const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-web-security', '--allow-insecure-localhost']
      });
      const page = await browser.newPage();

      await page.goto(
        'https://www.tiktok.com/login/phone-or-email/phone-password',
        { waitUntil: 'networkidle2' });

      // Chờ và nhập thông tin đăng nhập
      await page.waitForSelector('input[name="mobile"]', { visible: true });
      await page.type('input[name="mobile"]', username, { delay: 100 });
      await setTimeout(3000),
        await page.type('input[type="password"]', password, { delay: 100 });

      // Nhấn nút đăng nhập
      await Promise.all([
        await setTimeout(3000),
        page.click('button[type="submit"]'),
      ]);

      await page.waitForNavigation(); // wait for page to load

      const videoPath: string = 'C:\\Users\\buitr\\Downloads\\video1.mp4'
      const description: string = 'Đi ăn phở Hà Nội'
      await uploadVideoTiktok(videoPath, description)

      async function uploadVideoTiktok(videoPath: string, description: string) {
        // Điều hướng đến trang tải video
        await page.goto('https://www.tiktok.com/upload', {
          waitUntil: 'networkidle2',
          timeout: 60000
        });

        await page.waitForSelector('input[type="file"]', { timeout: 0 });
        // Upload the video
        const fileInput = await page.$('input[type="file"]');
        if (!fileInput) {
          throw new Error('File input not found. TikTok UI may have changed.');
        }
        await fileInput.uploadFile(videoPath);
        console.log('Video file selected.');

        // Wait for TikTok to process the video
        await setTimeout(10000);

        // Chờ cho ô nhập mô tả xuất hiện
        await page.waitForSelector('.public-DraftEditor-content[contenteditable="true"]');

        // Xóa nội dung trong phần tử contenteditable
        await page.evaluate(() => {
          const editableDiv = document.querySelector(
            '.public-DraftEditor-content[contenteditable="true"]') as HTMLElement;
          if (editableDiv) {
            editableDiv.innerHTML = ''; // Xóa nội dung
            editableDiv.dispatchEvent(new Event('input', { bubbles: true })); // Phát sự kiện nâng cao
          }
        });

        // Nhập mô tả mới vào ô nhập
        await page.type('.public-DraftEditor-content[contenteditable="true"]', description);

        // Click the Post button
        await setTimeout(10000);
        await page.waitForSelector('button[data-e2e="post_video_button"]', { visible: true });

        // Nhấn nút "Post"
        const postButton = await page.$('button[data-e2e="post_video_button"]');
        if (postButton) {
          await postButton.click(); // Nhấn nút "Post"
          console.log("Đã nhấn nút Post!");
        } else {
          console.error('Không tìm thấy nút "Post"!');
        }


        // Chờ modal xác nhận xuất hiện
        await page.waitForSelector('.TUXModal', { visible: true });
        await setTimeout(5000)

        // Sử dụng XPath để tìm nút "Post now"
        const postNowButtonHandle = await page.evaluateHandle(() => {
          const xpath = "//button[contains(., 'Post now')]"; // XPath để tìm nút
          const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          return result.singleNodeValue; // Trả về nút đầu tiên tìm thấy
        });

        if (postNowButtonHandle) {
          // Nhấn nút "Post now"
          await page.evaluate((button) => {
            (button as HTMLElement).click();
          }, postNowButtonHandle);
        } else {
          console.error('Không tìm thấy nút "Post now"!');
        }
        // Chờ 5 giây sau khi nhấn nút Post now
        await setTimeout(5000)


        console.log('Post submitted. Waiting for confirmation...');
        await setTimeout(10000);
      }
    } catch (error) {
      return `Error sign in : ${error}`;
    } finally {
      if (browser) {
        // await browser.close();
      }
    }
  }

}
