import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import * as https from 'https';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly BASE_URL = 'https://adilet.zan.kz';
  private readonly SEARCH_URL = 'https://adilet.zan.kz/rus/search/docs';

  constructor(private readonly httpService: HttpService) {}

  async search(query: string): Promise<any[]> {
    const url = `${this.SEARCH_URL}?q=${encodeURIComponent(query)}`;
    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          httpsAgent: agent,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml',
          },
          timeout: 10000
        })
      );

      const $ = cheerio.load(response.data);
      const results: any[] = [];

      $('div.search-results > div.row').each((i, el) => {
        const linkEl = $(el).find('a').first();
        const title = linkEl.text().trim();
        let link = linkEl.attr('href');
        const snippet = $(el).find('p').text().trim();
        const info = $(el).find('.infocol').text().trim();

        if (title && link) {
          if (!link.startsWith('http')) link = `${this.BASE_URL}${link}`;
          results.push({ 
            id: i, 
            title, 
            desc: snippet, 
            link,
            info 
          });
        }
      });

      return results;
    } catch (e) {
      this.logger.error(`Search error: ${e.message}`);
      return [];
    }
  }

  async getDocumentContent(url: string): Promise<any> {
    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          httpsAgent: agent,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          timeout: 15000
        })
      );

      const $ = cheerio.load(response.data);

      $('script, style, iframe, .noprint, .adilet-banner').remove();

      let contentHtml = $('.gazoo').html() || $('#zatext').html() || $('.main-content').html();

      if (!contentHtml) {
        contentHtml = '<p>Текст документа не распознан автоматически. Пожалуйста, перейдите по ссылке на источник.</p>';
      } else {
        contentHtml = contentHtml.replace(/href="\//g, `href="${this.BASE_URL}/`);
        contentHtml = contentHtml.replace(/src="\//g, `src="${this.BASE_URL}/`);
      }

      const infoHtml = $('.infocol').html() || '';

      return {
        title: $('h1').text().trim(),
        text: contentHtml,
        info: infoHtml,
        url: url
      };

    } catch (e) {
      this.logger.error(`Document fetch error: ${e.message}`);
      throw new Error('Не удалось загрузить документ');
    }
  }
}