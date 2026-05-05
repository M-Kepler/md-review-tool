import { test, expect } from '@playwright/test';
import { openContainer, loadFixture, waitForRender, triggerAppBindings, injectMarkdown } from '../helpers/test-utils';

test.describe('Checkbox 交互测试', () => {

    test.beforeEach(async ({ page }) => {
        await openContainer(page);
        await loadFixture(page, 'checkbox.md');
        await waitForRender(page);
    });

    test('BT-checkbox.1 Task list item 渲染正确的 DOM 结构', async ({ page }) => {
        // 验证 task-list-item 结构
        const taskItems = page.locator('.task-list-item');
        const count = await taskItems.count();
        expect(count).toBeGreaterThanOrEqual(5); // fixture 中有 5 个任务

        // 验证已勾选的任务有 .checked 类
        const checkedItems = page.locator('.task-list-item .task-checkbox.checked');
        const checkedCount = await checkedItems.count();
        expect(checkedCount).toBe(2); // fixture 中有 2 个已勾选

        // 验证未勾选的任务没有 .checked 类
        const uncheckedItems = page.locator('.task-list-item .task-checkbox:not(.checked)');
        const uncheckedCount = await uncheckedItems.count();
        expect(uncheckedCount).toBe(3); // fixture 中有 3 个未勾选
    });

    test('BT-checkbox.4 非编辑模式下 Checkbox 点击不应切换状态', async ({ page }) => {
        // 确保不在编辑模式
        await page.evaluate(() => {
            const docContent = document.getElementById('documentContent');
            if (docContent) {
                docContent.contentEditable = 'false';
                docContent.classList.remove('wysiwyg-editing');
            }
        });

        // 记录初始 checked 数量
        const initialChecked = await page.evaluate(() => {
            return document.querySelectorAll('.task-checkbox.checked').length;
        });

        // 点击未勾选的 checkbox
        const uncheckedSpan = page.locator('.task-checkbox:not(.checked)').first();
        await expect(uncheckedSpan).toBeVisible();
        await uncheckedSpan.click();
        await page.waitForTimeout(200);

        // 验证 checked 数量不变
        const afterChecked = await page.evaluate(() => {
            return document.querySelectorAll('.task-checkbox.checked').length;
        });
        expect(afterChecked).toBe(initialChecked);
    });
});
