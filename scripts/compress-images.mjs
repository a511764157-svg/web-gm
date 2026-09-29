// 图片处理脚本：node scripts/compress-images.mjs
//
// 做两件事：
//   1. 把 src/assets 下的占位图压缩到可上线体积（原图 94MB，单张最大 10MB）
//      文件名保持不变，所以组件里的 import 不受影响
//   2. 生成 public/og-image.jpg（1200×630 分享卡片图，必须有）
//
// 原图会备份到 assets-original/，随时可还原

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const { readdirSync, mkdirSync, copyFileSync, statSync, writeFileSync, readFileSync, existsSync } = fs;

const ASSETS = path.resolve('src/assets');
const BACKUP = path.resolve('assets-original');
const PUBLIC = path.resolve('public');
const MAX_WIDTH = 1600;
const QUALITY = 80;

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

async function main() {
  mkdirSync(BACKUP, { recursive: true });
  mkdirSync(PUBLIC, { recursive: true });

  const files = readdirSync(ASSETS).filter((f) => /\.(jpe?g|png)$/i.test(f));
  if (!files.length) {
    console.log('src/assets 下没有找到图片');
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;

  console.log(`共 ${files.length} 张图片，开始压缩…\n`);

  for (const file of files) {
    const src = path.join(ASSETS, file);

    // 备份原图（只备份一次）
    const backupFile = path.join(BACKUP, file);
    if (!existsSync(backupFile)) {
      copyFileSync(src, backupFile);
    }

    const before = statSync(src).size;
    // 先整读进内存再交给 sharp：否则 sharp 会持有源文件句柄，
    // Windows 下无法覆盖一个正被打开的文件（errno -4094 UNKNOWN）
    const srcBuf = readFileSync(src);
    const buf = await sharp(srcBuf)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();

    // 用同步 API 写盘：当前环境下 node 的异步 fs 写入会被拦截
    writeFileSync(src, buf);
    const after = statSync(src).size;

    totalBefore += before;
    totalAfter += after;
    console.log(`${file.padEnd(46)} ${mb(before).padStart(10)} → ${mb(after).padStart(10)}`);
  }

  console.log(`\n合计：${mb(totalBefore)} → ${mb(totalAfter)}（压缩 ${(100 - (totalAfter / totalBefore) * 100).toFixed(1)}%）`);
  console.log(`原图已备份到：${BACKUP}\n`);

  // ---- 生成 og-image（分享卡片图）----
  const cover = files[0];
  const title = process.env.OG_TITLE || 'Custom Metal Parts Manufacturer';
  const subtitle = process.env.OG_SUBTITLE || 'CNC machining · Sheet metal · Casting';

  const overlay = Buffer.from(`<svg width="1200" height="630">
    <rect width="1200" height="630" fill="rgba(15,23,42,0.55)"/>
    <text x="60" y="330" font-family="sans-serif" font-size="64" font-weight="bold" fill="#ffffff">${title}</text>
    <text x="60" y="390" font-family="sans-serif" font-size="34" fill="#cbd5e1">${subtitle}</text>
    <rect x="60" y="430" width="120" height="6" fill="#14b8a6"/>
  </svg>`);

  const ogBuf = await sharp(readFileSync(path.join(ASSETS, cover)))
    .resize(1200, 630, { fit: 'cover' })
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 82 })
    .toBuffer();
  writeFileSync(path.join(PUBLIC, 'og-image.jpg'), ogBuf);

  console.log(`已生成分享卡片图：public/og-image.jpg（1200×630）`);
  console.log('提示：正式上线前请换成厂家真实车间照片，并替换 src/assets 里的占位图。');
}

main().catch((err) => {
  console.error('处理失败：', err);
  process.exit(1);
});
