/**
 * 回归测试：Task List Tight — 编辑模式下换行新增列表项不应产生空行
 *
 * 验证 pm-schema.js 中 bullet_list/ordered_list 的 tight 属性默认为 true，
 * 以及 pm-markdown-bridge.js 中 parser 正确检测 tight 状态，
 * 使得序列化时列表项之间不会产生多余空行。
 */
import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

suite('Hotfix — Task List Tight（列表项无空行）', () => {
    const extPath = vscode.extensions.getExtension('letitia.md-human-review')!.extensionPath;

    // ===== Tier 1 — 存在性断言 =====

    test('BT-TaskListTight.T1.1 Tier1 — pm-schema.js bullet_list 应包含 tight 属性定义', () => {
        const src = fs.readFileSync(path.join(extPath, 'webview', 'js', 'pm-schema.js'), 'utf-8');
        const bulletListIdx = src.indexOf('bullet_list:');
        const bulletListSection = src.substring(bulletListIdx, bulletListIdx + 300);
        assert.ok(bulletListSection.includes('tight'), 'bullet_list schema 应包含 tight 属性');
        assert.ok(bulletListSection.includes('default: true'), 'bullet_list tight 属性默认值应为 true');
    });

    test('BT-TaskListTight.T1.2 Tier1 — pm-schema.js ordered_list 应包含 tight 属性定义', () => {
        const src = fs.readFileSync(path.join(extPath, 'webview', 'js', 'pm-schema.js'), 'utf-8');
        const orderedListIdx = src.indexOf('ordered_list:');
        const orderedListSection = src.substring(orderedListIdx, orderedListIdx + 400);
        assert.ok(orderedListSection.includes('tight'), 'ordered_list schema 应包含 tight 属性');
        assert.ok(orderedListSection.includes('default: true'), 'ordered_list tight 属性默认值应为 true');
    });

    test('BT-TaskListTight.T1.3 Tier1 — pm-markdown-bridge.js 应包含 listIsTight 辅助函数', () => {
        const src = fs.readFileSync(path.join(extPath, 'webview', 'js', 'pm-markdown-bridge.js'), 'utf-8');
        assert.ok(src.includes('listIsTight'), 'pm-markdown-bridge.js 应定义 listIsTight 函数');
    });

    // ===== Tier 3 — 任务特定断言 =====

    test('BT-TaskListTight.1 Tier3 — bullet_list parser 应通过 listIsTight 检测 tight 属性', () => {
        const src = fs.readFileSync(path.join(extPath, 'webview', 'js', 'pm-markdown-bridge.js'), 'utf-8');
        const bulletListIdx = src.indexOf("bullet_list:");
        const bulletListSection = src.substring(bulletListIdx, bulletListIdx + 200);
        assert.ok(bulletListSection.includes('listIsTight'), 'bullet_list parser getAttrs 应调用 listIsTight');
        assert.ok(bulletListSection.includes('tight'), 'bullet_list parser getAttrs 应返回 tight 属性');
    });

    test('BT-TaskListTight.2 Tier3 — ordered_list parser 应通过 listIsTight 检测 tight 属性', () => {
        const src = fs.readFileSync(path.join(extPath, 'webview', 'js', 'pm-markdown-bridge.js'), 'utf-8');
        const orderedListIdx = src.indexOf("ordered_list:");
        const orderedListSection = src.substring(orderedListIdx, orderedListIdx + 200);
        assert.ok(orderedListSection.includes('listIsTight'), 'ordered_list parser getAttrs 应调用 listIsTight');
        assert.ok(orderedListSection.includes('tight'), 'ordered_list parser getAttrs 应返回 tight 属性');
    });

    test('BT-TaskListTight.3 Tier3 — listIsTight 应检查 list_item_open 后的 token.hidden 属性', () => {
        const src = fs.readFileSync(path.join(extPath, 'webview', 'js', 'pm-markdown-bridge.js'), 'utf-8');
        const fnIdx = src.indexOf('function listIsTight');
        assert.ok(fnIdx !== -1, 'listIsTight 函数应存在');
        const fnSection = src.substring(fnIdx, fnIdx + 300);
        assert.ok(fnSection.includes('list_item_open'), 'listIsTight 应检查 list_item_open token');
        assert.ok(fnSection.includes('.hidden'), 'listIsTight 应返回 token.hidden 属性');
    });

    test('BT-TaskListTight.4 Tier3 — pm.bundle.js 应包含 tight 属性和 listIsTight 逻辑', () => {
        const bundle = fs.readFileSync(path.join(extPath, 'webview', 'dist', 'pm.bundle.js'), 'utf-8');
        assert.ok(bundle.includes('listIsTight'), 'pm.bundle.js 应包含 listIsTight 函数');
        assert.ok(bundle.includes('data-tight'), 'pm.bundle.js 应包含 data-tight DOM 属性');
    });
});
