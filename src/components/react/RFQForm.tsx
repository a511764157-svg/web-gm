import { useState } from 'react';
import Icon from 'astro-iconset/react';
import { FORMS, CONTACT, COMPANY } from '../../config/site';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const endpoint = FORMS.rfqEndpoint;
const accessKey = FORMS.accessKey;
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

  // 未配置提交端点时只给 WhatsApp / 邮箱入口（配合 FB Instant Forms 的默认策略）
  if (!hasForm) {
    return (
      <div className="rounded-2xl border-2 border-gray-100 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25D366]/10">
          <Icon name="lucide:message-circle" className="h-8 w-8 text-[#25D366]" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">Talk to Our Engineers</h2>
        <p className="mb-8 text-gray-600 leading-relaxed">
          Send us your drawings and requirements. Our engineering team replies with DFM feedback
          and a quotation within 24 hours.
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
          Accepted drawing formats: STEP · STP · IGS · X_T · PDF · DXF
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus('submitting');
    trackLead();

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
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

      <div>
        <h2 className="mb-1 text-2xl font-bold text-gray-900">Request a Quote</h2>
        <p className="text-sm text-gray-600">
          Send your drawings — we reply within 24 hours with DFM feedback and pricing.
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
          placeholder="Material, quantity, tolerances, surface finish, target lead time…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {FORMS.allowFileUpload ? (
        <div>
          <label htmlFor="drawing" className={labelClass}>
            Drawing or 3D model <span className="font-normal text-gray-400">(optional)</span>
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
          <p className="text-sm font-semibold text-gray-700">Sending drawings?</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            After submitting, send your STEP · STP · IGS · X_T · PDF · DXF files by WhatsApp or
            email — we quote faster with drawings in hand.
          </p>
        </div>
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
          Something went wrong. Please email us directly at{' '}
          <a href={`mailto:${CONTACT.email}`} className="underline">
            {CONTACT.email}
          </a>
          .
        </p>
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
