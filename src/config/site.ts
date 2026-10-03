// ============================================================
// 站点配置 —— 换厂家时主要改这一个文件
// 标注 TODO 的字段是每个客户都必须替换的
// ============================================================

export const SITE = {
  // ---- 基础身份 ----
  title: 'Precision Machinery Co., Ltd.',        // TODO: 厂家英文公司名
  description:
    'Custom CNC machining, sheet metal fabrication and casting parts manufacturer. ISO 9001 certified, ±0.01 mm precision, exporting to 50+ countries.', // TODO: 一句话简介
  url: 'https://zzqwdz.fun',                      // 正式域名（影响 og:url 和分享卡片）
  author: 'Precision Machinery Co., Ltd.',        // TODO: 同公司名
  tagline: 'Custom Metal Parts, Built to Your Drawings', // TODO: 首屏副标题
  heroTitle: 'Custom Metal Parts,',                      // TODO: 首屏主标题第一行
  heroHighlight: 'Built to Your Drawings',               // TODO: 首屏主标题高亮行
  heroSubline: 'CNC machining, sheet metal fabrication and casting — from prototype to volume production, shipped worldwide.', // TODO: 首屏描述

  // ---- 品牌素材 ----
  logo: '',                                       // TODO: 厂家 Logo（放 public/logo.png 后填 '/logo.png'），留空则显示公司名文字
  ogImage: '/og-image.jpg',                       // TODO: 1200×630 分享图，必须有，否则分享出去没缩略图
  heroVideo: '',                                  // TODO: 工厂巡览视频 mp4（放在 public/ 下），留空则显示图片
  heroImage: '/hero-factory.jpg',                 // TODO: 首屏大图
} as const;

// ---- 联系方式（社交流量的主要承接入口）----
export const CONTACT = {
  phone: '+86-371-8888-8888',                     // TODO
  whatsapp: '8613800000000',                      // TODO: 纯数字，含国际区号，不要加 + 和空格
  email: 'sales@zzqwdz.fun',                      // TODO: 确认这个邮箱真实存在且能收信
  address: 'No.1 Industrial Park, Zhengzhou, Henan, China', // TODO
  telegram: '',                                   // 可选：俄罗斯/东欧/中东市场才需要，留空则不显示
} as const;

// ---- 公司实力数字（B2B 买家只信数字）----
export const COMPANY = {
  founded: '2005',                                // TODO
  years: '20+',                                   // TODO: 年限
  countries: '50+',                               // TODO: 出口国家数
  precision: '±0.01 mm',                          // TODO: 加工精度
  response: '24h',                                // TODO: 报价响应时限
  area: '12,000 m²',                              // TODO: 厂房面积
  staff: '180',                                   // TODO: 员工数
  machines: '50+',                                // TODO: 设备台数
} as const;

// ---- 首页数字条（四件套）----
export const STATS = [
  { value: COMPANY.years, label: 'Years of Experience', desc: 'Manufacturing and exporting custom metal parts.' },
  { value: COMPANY.countries, label: 'Countries Served', desc: 'Europe, North America, Middle East, Southeast Asia.' },
  { value: COMPANY.precision, label: 'Precision Guaranteed', desc: 'Advanced quality control and inspection equipment.' },
  { value: COMPANY.response, label: 'Quote Response', desc: 'Engineering feedback on your drawings within 24 hours.' },
] as const;

// ---- 出口市场（首页展示，按客户实际情况增删）----
export const EXPORT_MARKETS = [
  'Europe',
  'North America',
  'Middle East',
  'Southeast Asia',
  'Australia',
  'South America',
] as const;

// ---- 认证（B2B 信任核心要素）----
export const CERTIFICATIONS = [
  { name: 'ISO 9001', desc: 'Quality management system' },
  { name: 'CE', desc: 'European conformity' },
  { name: 'IATF 16949', desc: 'Automotive quality standard' },
  { name: 'SGS', desc: 'Third-party verified' },
] as const;

// ---- 询盘表单提交端点 ----
// 留空则用 WhatsApp 作为唯一入口（配合 FB Instant Forms 时推荐）
// 填写 Formspree 地址则启用官网表单：https://formspree.io/f/xxxxxxxx
export const FORMS = {
  rfqEndpoint: '',                                // TODO: 留空 = 隐藏官网表单，只留 WhatsApp
} as const;

// ---- 追踪代码 ----
// 推荐用 GTM：所有 Pixel 在 GTM 后台管理，改追踪代码不用重新构建上传
export const TRACKING = {
  gtmId: '',                                      // TODO: GTM-XXXXXXX
  fbPixelId: '',                                  // 可选：不用 GTM 时直接填 Pixel ID
} as const;

// ---- 导航 ----
// 信任背书页：导航越短越像真工厂官网，不要往回加页面
export const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'Capabilities', href: '/capabilities' },
  { name: 'Contact', href: '/rfq' },
] as const;

// ---- 社交媒体 ----
export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/yourcompany',   // TODO
  twitter: 'https://twitter.com/yourcompany',             // TODO
  facebook: 'https://facebook.com/yourcompany',           // TODO
  youtube: '',                                            // 可选
} as const;
