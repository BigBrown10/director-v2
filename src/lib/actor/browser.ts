import { chromium, Browser, BrowserContext, Page } from 'playwright';
import path from 'path';

export interface ActorSession {
    browser: Browser;
    context: BrowserContext;
    page: Page;
}

export async function launchBrowser(): Promise<ActorSession> {
    const browser = await chromium.launch({
        headless: false, // For debugging, initially false. In production/container this will be true or controlled by env.
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
        ],
    });

    // Create videos directory if it doesn't exist (handled by caller or ensure here if simple)
    // relying on relative path for this demo
    const videoDir = path.resolve(process.cwd(), 'videos');

    const context = await browser.newContext({
        viewport: { width: 3840, height: 2160 }, // 4K Resolution
        deviceScaleFactor: 2, // Retina quality
        recordVideo: {
            dir: videoDir,
            size: { width: 3840, height: 2160 },
        },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    return { browser, context, page };
}

export async function closeBrowser(session: ActorSession) {
    await session.context.close(); // Ensures video is saved
    await session.browser.close();
}
