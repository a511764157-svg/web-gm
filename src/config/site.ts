// ============================================================
// 站点配置 —— 换厂家时主要改这一个文件
// 标注 TODO 的字段是每个客户都必须替换的
// ============================================================

export const SITE = {
  // ---- 基础身份 ----
  title: 'Henan Greenbo Energy Equipment Co., Ltd.',
  description:
    'Fire extinguisher production equipment manufacturer — automatic dry powder filling lines, leak detection, labelling and screen printing machines, plus service equipment. 160+ patents, exporting across Asia and Africa.',
  url: 'https://zzqwdz.fun',                      // 正式域名（影响 og:url 和分享卡片）
  author: 'Henan Greenbo Energy Equipment Co., Ltd.',
  tagline: 'Automatic Fire Extinguisher Production Lines',
  heroTitle: 'Fire Extinguisher',
  heroHighlight: 'Production Equipment',
  heroSubline: 'From cylinder welding to powder filling, leak testing, printing, labelling and packing — complete automated lines engineered in-house and delivered worldwide.',

  // ---- 品牌素材 ----
  logo: '',                                       // TODO: 厂家 Logo（放 public/logo.png 后填 '/logo.png'），留空则显示公司名文字
  ogImage: '/og-image.jpg',                       // TODO: 1200×630 分享图，必须有，否则分享出去没缩略图
  heroVideo: '',                                  // TODO: 工厂巡览视频 mp4（放在 public/ 下），留空则显示图片
  heroImage: '/hero-factory.jpg',                 // TODO: 首屏大图
} as const;

// ---- 联系方式（社交流量的主要承接入口）----
export const CONTACT = {
  phone: '+86 17634872119',                       // 贺经理
  whatsapp: '8617634872119',                      // 与手机号一致；若留 8613800000000，全站 WhatsApp 入口会自动隐藏
  email: '200896215@qq.com',                      // 客户官网公开邮箱
  address: 'Xiaodong Industrial Zone, Wuzhi County, Jiaozuo, Henan, China',
  telegram: '',                                   // 可选：俄罗斯/东欧/中东市场才需要，留空则不显示
} as const;

// ---- 公司实力数字（B2B 买家只信数字）----
export const COMPANY = {
  founded: '2006',
  years: '20',                                    // 2006 至今
  countries: '5+',                                // 韩国 / 印尼 / 菲律宾 / 越南 / 埃塞俄比亚
  patents: '160+',                                // 专利总数（其中发明 3 项，每年新增 30+）
  precision: '±1% Fill',                          // 灌装精度（灭火器灌装的关键指标）
  response: '24h',                                // 报价响应时限
  area: '2,000 m²',                               // 厂房面积
  staff: '40+',                                   // 员工数
  machines: '34',                                 // 产品型号数（生产设备 18 + 维修设备 16）
} as const;

// ---- 首页数字条（四件套）----
export const STATS = [
  { value: COMPANY.years, label: 'Years in Automation', desc: 'Building fire extinguisher production equipment since 2006.' },
  { value: COMPANY.patents, label: 'Patents Granted', desc: 'Including 3 invention patents, with 30+ new filings each year.' },
  { value: COMPANY.countries, label: 'Countries Served', desc: 'South Korea, Indonesia, Philippines, Vietnam and Ethiopia.' },
  { value: COMPANY.response, label: 'Quote Response', desc: 'Line proposal and pricing sent within 24 hours.' },
] as const;

// ---- 出口市场（首页展示，按客户实际情况增删）----
export const EXPORT_MARKETS = [
  'South Korea',
  'Indonesia',
  'Philippines',
  'Vietnam',
  'Ethiopia',
] as const;

// ---- 认证 / 资质 ----
// 该客户暂无 CE / ISO，不编。以下四条均取自其官网公开信息。
export const CERTIFICATIONS = [
  { name: `${COMPANY.patents} Patents`, desc: 'National patents, 3 of them invention patents' },
  { name: 'In-house R&D', desc: 'Automation and intelligent design team' },
  { name: 'Full-Line Capability', desc: 'Steel plate → cylinder → painting → filling → testing → printing → packing' },
  { name: 'After-Sales Service', desc: 'Installation, training and lifetime technical support' },
] as const;

// ---- 询盘表单提交端点 ----
// 留空则用 WhatsApp 作为唯一入口（配合 FB Instant Forms 时推荐）
// 填写 Formspree 地址则启用官网表单：https://formspree.io/f/xxxxxxxx
export const FORMS = {
  // Web3Forms —— 无后端表单服务，提交后直接转发到注册邮箱
  // 提交地址固定，不需要改；要换服务商时才动
  rfqEndpoint: 'https://api.web3forms.com/submit',

  // Web3Forms Dashboard 的 Access Key（公开字段，设计上就放在前端代码里）
  accessKey: 'a3ef3b60-1b99-4090-96e3-e6ae670d8211',

  // Web3Forms 免费版不支持文件上传（Pro 才有，5MB/文件）。
  // false 时不渲染图纸上传框，改为提示客户提交后用 WhatsApp 发图纸 ——
  // 否则免费版会静默吞掉文件，客户以为发了、工程师收不到，最危险。
  allowFileUpload: false,

  // Cloudflare Turnstile 的 Site Key（公开的一半，放前端没问题）。
  // 留空 = 不启用，表单照常工作。
  //
  // 为什么需要它：access_key 本来就公开在前端，别人不用打开网站，
  // 直接 curl 提交端点就能把额度刷光 —— 免费 250 和付费 10k 都一样扛不住。
  // Turnstile 是目前唯一能真正堵住这个洞、又不用自己搭后端的办法：
  // token 由 Cloudflare 签发（一次性、5 分钟有效），攻击者伪造不出来。
  //
  // 启用步骤（需要 Web3Forms 付费档，这是它的 Pro 功能）：
  //   1. Cloudflare Dashboard → Turnstile → 建 widget，模式选 Managed，
  //      把正式域名加进 Hostname
  //   2. 复制 Site Key 填到这儿；Secret Key 填到 Web3Forms 后台
  //      （表单 Settings → captcha 选 Turnstile → 贴 Secret Key）
  //   3. 校验在 Web3Forms 服务端做，我们的站依然是纯静态
  // Secret Key 绝对不要出现在前端代码里。
  turnstileSiteKey: '0x4AAAAAAFNfQkaluYeGPdf2',
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
  { name: 'Equipment', href: '/capabilities' },
  { name: 'Contact', href: '/rfq' },
] as const;

// ---- 社交媒体 ----
export const SOCIAL_LINKS = {
  linkedin: '',                                   // TODO: 客户没有就留空，不显示
  twitter: '',
  facebook: '',
  youtube: '',
} as const;
