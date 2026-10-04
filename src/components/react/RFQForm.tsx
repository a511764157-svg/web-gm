import { useEffect, useRef, useState } from 'react';
import Icon from 'astro-iconset/react';
import { FORMS, CONTACT, COMPANY } from '../../config/site';

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'blocked';

// 免费版每月只有 250 次提交，额度刷完就整月收不到询盘。
// 下面这套是「不用验证码」的客户端节流，拦的是广撒网的垃圾脚本和手抖重复提交。
// 注意它的天花板：access_key 本来就公开在前端，真要恶意刷的人直接 curl 端点，
// 这些判断全部绕得过去。真正按 IP 限流只能靠自建后端（见 memory 里的方案讨论）。
const MIN_FILL_MS = 3000; // 三个字段（姓名/联系方式/需求）不可能在 3 秒内填完
const COOLDOWN_MS = 60_000; // 同一浏览器两次提交的最小间隔
const DAILY_LIMIT = 3; // 同一浏览器每天最多提交次数
const LS_LAST = 'rfq_last_submit';
const LS_DAY = 'rfq_day';

function readLS(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // 无痕模式 / 禁用存储时当作没有记录
  }
}
function writeLS(key: string, val: string) {
  try {
    window.localStorage.setItem(key, val);
  } catch {
    /* 存不了就算了，不影响提交 */
  }
}

type Quota = 'ok' | 'cooldown' | 'daily';

function checkQuota(): Quota {
  const now = Date.now();
  const last = Number(readLS(LS_LAST) ?? 0);
  if (last && now - last < COOLDOWN_MS) return 'cooldown';

  const today = new Date().toISOString().slice(0, 10);
  const [day, count] = (readLS(LS_DAY) ?? '').split('|');
  if (day === today && Number(count) >= DAILY_LIMIT) return 'daily';

  return 'ok';
}

function bumpQuota() {
  const today = new Date().toISOString().slice(0, 10);
  const [day, count] = (readLS(LS_DAY) ?? '').split('|');
  writeLS(LS_DAY, `${today}|${day === today ? Number(count) + 1 : 1}`);
  writeLS(LS_LAST, String(Date.now()));
}

// Turnstile 的 token 只能用一次，提交失败后必须重置，否则客户再点一次
// 会带着已失效的 token 被判为机器人。
function resetTurnstile() {
  if (!turnstileKey) return;
  const w = window as unknown as { turnstile?: { reset: () => void } };
  if (typeof w.turnstile?.reset === 'function') w.turnstile.reset();
}

const endpoint = FORMS.rfqEndpoint;
const accessKey = FORMS.accessKey;
const turnstileKey: string = FORMS.turnstileSiteKey; // 留空则不启用
// 端点或 access key 任一为空 → 降级为 WhatsApp / 邮箱卡片
const hasForm = Boolean(endpoint && accessKey);
const waHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
  'Hello, I found your website and I would like to request a quote.'
)}`;
const hasWhatsApp = Boolean(CONTACT.whatsapp && CONTACT.whatsapp !== '8613800000000');

function trackLead() {
  const w = window as unknown as {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: 'rfq_submit' });
  if (typeof w.fbq === 'function') w.fbq('track', 'Lead');
}

const inputClass =
  'w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900';
const labelClass = 'block text-sm font-semibold text-gray-700 mb-2';

export default function RFQForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [blockMsg, setBlockMsg] = useState('');
  const mountedAt = useRef(0);
  if (!mountedAt.current) mountedAt.current = Date.now();

  useEffect(() => {
    if (!turnstileKey) return;
    if (document.querySelector('script[data-turnstile-loader]')) return;
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    s.defer = true;
    s.dataset.turnstileLoader = 'true';
    document.head.appendChild(s);
  }, []);

  // 未配置提交端点时只给 WhatsApp / 邮箱入口（配合 FB Instant Forms 的默认策略）
  if (!hasForm) {
    return (
      <div className="rounded-2xl border-2 border-gray-100 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25D366]/10">
          <Icon name="lucide:message-circle" className="h-8 w-8 text-[#25D366]" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">Talk to Our Engineers</h2>
        <p className="mb-8 text-gray-600 leading-relaxed">
          Tell us your extinguisher type, cylinder size and target output. Our engineering team
          replies with a line plan and pricing within 24 hours.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {hasWhatsApp && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackLead}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white shadow-md transition-all hover:brightness-95"
            >
              <Icon name="lucide:message-circle" className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          )}
          <a
            href={`mailto:${CONTACT.email}`}
            onClick={trackLead}
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all hover:border-blue-400 hover:text-blue-700"
          >
            <Icon name="lucide:mail" className="h-5 w-5" />
            <span className="select-all">{CONTACT.email}</span>
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Useful to attach: workshop layout, cylinder drawing, photos of your current line
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // ① 自定义蜜罐：真人看不见，脚本会挨个填空。命中就直接给「成功」假象，
    //    不发请求 —— 既不耗额度，也不会提示机器人换个姿势再来。
    if (String(formData.get('fax_number') ?? '').trim()) {
      setStatus('success');
      return;
    }

    // ② 时间陷阱：从页面加载到提交不足 3 秒，只可能是脚本。
    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus('success');
      return;
    }

    // ③ 本机限流：冷却时间 / 每天次数。
    const quota = checkQuota();
    if (quota === 'cooldown') {
      setBlockMsg('You just sent a request. Please wait a minute before sending another one.');
      setStatus('blocked');
      return;
    }
    if (quota === 'daily') {
      setBlockMsg('We have received several requests from this browser today.');
      setStatus('blocked');
      return;
    }

    // 本表单只有一个 contact 字段（邮箱或 WhatsApp 号都能填），而 Web3Forms
    // 是靠 email / replyto 字段来设置「回复到」的。所以判断一下：
    // 填的内容像邮箱就补一个 replyto，这样邮件里点「回复」能直接回给客户。
    // 填的是电话号码就不设，避免把无效邮箱塞给 Web3Forms。
    const contact = String(formData.get('contact') ?? '').trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)) {
      formData.append('replyto', contact);
    }

    setStatus('submitting');
    trackLead();

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        bumpQuota();
        setStatus('success');
        form.reset();
      } else {
        // 429 = 这个月 250 次额度用完了，必须给客户一条能走通的路
        setBlockMsg(
          res.status === 429
            ? 'Our inbox is temporarily full. Please reach us by WhatsApp or email instead.'
            : ''
        );
        setStatus('error');
        resetTurnstile();
      }
    } catch {
      setBlockMsg('');
      setStatus('error');
      resetTurnstile();
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border-2 border-green-100 bg-green-50 p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
          <Icon name="lucide:check" className="h-8 w-8 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Request Received</h2>
        <p className="text-gray-700">
          Thank you. Our engineering team will reply within 24 hours with DFM feedback and a
          quotation.
        </p>
        {hasWhatsApp && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white hover:brightness-95"
          >
            <Icon name="lucide:message-circle" className="h-5 w-5" />
            Need it faster? Chat on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" name="rfq-form">
      {/* Web3Forms 必需字段 */}
      <input type="hidden" name="access_key" value={accessKey} />
      <input type="hidden" name="subject" value="New RFQ from website" />
      <input type="hidden" name="from_name" value={COMPANY.name} />
      {/* 蜜罐字段：真人看不见，机器人会勾选 → 被 Web3Forms 判为垃圾提交 */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />
      {/* 第二个蜜罐：botcheck 是 Web3Forms 认的字段名，这个是我们自己认的。
          名字取 fax_number 是为了避开浏览器的自动填充（用 website 会被密码管理器填）。 */}
      <div aria-hidden="true" style={{ display: 'none' }}>
        <label htmlFor="fax_number">Fax</label>
        <input id="fax_number" name="fax_number" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <h2 className="mb-1 text-2xl font-bold text-gray-900">Request a Quote</h2>
        <p className="text-sm text-gray-600">
          Tell us your target output — we reply within 24 hours with equipment selection and pricing.
        </p>
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Name <span className="text-red-500">*</span>
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
      </div>

      <div>
        <label htmlFor="contact" className={labelClass}>
          Email or WhatsApp <span className="text-red-500">*</span>
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          required
          placeholder="you@company.com  or  +1 234 567 8900"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          What do you need? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Extinguisher type, cylinder size, units per shift, workshop size…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {FORMS.allowFileUpload ? (
        <div>
          <label htmlFor="drawing" className={labelClass}>
            Layout, cylinder drawing or photos <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="drawing"
            name="drawing"
            type="file"
            accept=".pdf,.step,.stp,.igs,.iges,.x_t,.dxf,.dwg,.jpg,.jpeg,.png"
            className="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
          />
          <p className="mt-2 text-xs text-gray-500">STEP · STP · IGS · X_T · PDF · DXF</p>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-700">Sending a layout or cylinder drawing?</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            After submitting, send your workshop layout, cylinder drawing or photos of your current
            line by WhatsApp or email — we quote faster with them in hand.
          </p>
        </div>
      )}

      {/* Cloudflare Turnstile：未配置 site key 时整个块不渲染，保持纯静态 */}
      {turnstileKey && (
        <div className="cf-turnstile" data-sitekey={turnstileKey} data-theme="light" />
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-teal-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-teal-700 disabled:opacity-60"
      >
        <span>{status === 'submitting' ? 'Sending…' : 'Send My Request'}</span>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      {status === 'error' && (
        <p className="text-center text-sm text-red-600">
          {blockMsg || 'Something went wrong.'} Please email us directly at{' '}
          <a href={`mailto:${CONTACT.email}`} className="underline">
            {CONTACT.email}
          </a>
          .
        </p>
      )}

      {status === 'blocked' && (
        <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-sm text-amber-900">{blockMsg}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {hasWhatsApp && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
              >
                <Icon name="lucide:message-circle" className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            )}
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-amber-300 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-100"
            >
              <Icon name="lucide:mail" className="h-4 w-4" />
              <span className="select-all">{CONTACT.email}</span>
            </a>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-500">
        By submitting this form, you agree to our{' '}
        <a href="/privacy" className="underline hover:text-blue-600">
          Privacy Policy
        </a>
        .
      </p>

      {hasWhatsApp && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackLead}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#25D366] px-6 py-3 font-semibold text-[#128C7E] transition-all hover:bg-[#25D366]/5"
        >
          <Icon name="lucide:message-circle" className="h-5 w-5" />
          Prefer to chat? WhatsApp us
        </a>
      )}
    </form>
  );
}
