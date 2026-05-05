import { test, expect } from '@playwright/test';
import { openContainer, loadFixture, waitForRender, injectMarkdown } from '../helpers/test-utils';

test.describe('编辑模式测试', () => {

    test.beforeEach(async ({ page }) => {
        await openContainer(page);
        await loadFixture(page, 'edit-mode.md');
        await waitForRender(page);
    });

    test('BT-edit.1 编辑模式切换按钮存在', async ({ page }) => {
        const modeToggle = page.locator('#btnModeToggle');
        await expect(modeToggle).toBeVisible();
    });
});
