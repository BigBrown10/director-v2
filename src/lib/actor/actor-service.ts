import { DirectorScript, TimelineEvent } from "@/types/director";
import { launchBrowser, closeBrowser, ActorSession } from "./browser";
import { createCursor, GhostCursor } from "ghost-cursor";
import { Page } from "playwright";

export class Actor {
    private session: ActorSession | null = null;
    private cursor: GhostCursor | null = null;

    async recordSession(script: DirectorScript): Promise<string> {
        console.log(`[Actor] Starting recording for Job ${script.jobId}`);

        this.session = await launchBrowser();
        const { page, context } = this.session;
        this.cursor = createCursor(page);

        try {
            // Execute events sequentially
            for (const event of script.events) {
                await this.performAction(page, event);
            }

            // Wait a bit at the end for final frames
            await page.waitForTimeout(2000);

        } catch (error) {
            console.error("[Actor] Error during recording:", error);
            throw error;
        } finally {
            // Get video path before closing
            const videoPage = page.video();
            const videoPath = await videoPage?.path();

            await closeBrowser(this.session);

            if (!videoPath) {
                throw new Error("No video file generated.");
            }

            console.log(`[Actor] Recording saved to: ${videoPath}`);
            return videoPath;
        }
    }

    private async performAction(page: Page, event: TimelineEvent) {
        console.log(`[Actor] Action: ${event.action} -> ${event.description}`);

        // Safety delay based on timestamp (simple sync, in real app might need precise scheduling)
        // For now we just run them sequentially assuming the script duration is roughly sums of actions + waits

        switch (event.action) {
            case 'nav':
                if (event.value) {
                    await page.goto(event.value, { waitUntil: 'domcontentloaded' });
                }
                break;

            case 'click':
                if (event.selector) {
                    try {
                        if (this.cursor) await this.cursor.click(event.selector);
                        else await page.click(event.selector);
                    } catch (e) {
                        console.warn("[Actor] Ghost cursor failed, falling back to native click", e);
                        await page.click(event.selector);
                    }
                }
                break;

            case 'type':
                if (event.selector && event.value) {
                    try {
                        if (this.cursor) await this.cursor.click(event.selector);
                        else await page.click(event.selector);
                    } catch (e) {
                        console.warn("[Actor] Ghost cursor click failed", e);
                        await page.click(event.selector);
                    }
                    await page.type(event.selector, event.value, { delay: 100 }); // Natural typing delay
                }
                break;

            case 'hover':
                if (event.selector) {
                    try {
                        if (this.cursor) await this.cursor.move(event.selector);
                        else await page.hover(event.selector);
                    } catch (e) {
                        console.warn("[Actor] Ghost cursor move failed, falling back to native hover", e);
                        await page.hover(event.selector);
                    }
                }
                break;

            case 'scroll':
                // Simple scroll down or to element
                if (event.selector) {
                    await this.cursor?.move(event.selector);
                } else {
                    await page.evaluate(() => window.scrollBy(0, 500));
                }
                break;

            case 'wait':
                await page.waitForTimeout(2000); // Default to 2s or parse duration if added to schema
                break;

            default:
                console.warn(`[Actor] Unknown action: ${event.action}`);
        }

        if (event.zoom_target) {
            // We don't zoom in the browser session itself usually (CSS transform scale maybe?)
            // The "Director" PRD says: "Remotion... to smoothly zoom into those coordinates"
            // So here we just ensure the element is visible/centered for the recording.
            if (event.selector) {
                const element = page.locator(event.selector).first();
                await element.scrollIntoViewIfNeeded();
            }
        }
    }
}
