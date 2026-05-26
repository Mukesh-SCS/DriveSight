import Link from "next/link";
import { LegalSection } from "@/components/legal/LegalSection";
import { LEGAL_CONFIG } from "@/lib/legal/constants";
import { SITE_CONFIG } from "@/lib/seo/config";

export function CookiesContent() {
  const { effectiveDate, effectiveDateIso, supportEmail } = LEGAL_CONFIG;

  return (
    <>
      <header className="legal-page-header">
        <p className="eyebrow">Legal</p>
        <h1>Cookie Policy</h1>
        <p className="legal-page-lead">
          This policy explains how {SITE_CONFIG.name} uses cookies, local storage, and
          similar technologies when you visit or use the Service.
        </p>
        <dl className="legal-meta">
          <div>
            <dt>Effective date</dt>
            <dd>
              <time dateTime={effectiveDateIso}>{effectiveDate}</time>
            </dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd>
              <time dateTime={effectiveDateIso}>{effectiveDate}</time>
            </dd>
          </div>
        </dl>
      </header>

      <LegalSection id="what" title="1. What are cookies?" variant="highlight">
        <p>
          Cookies are small text files stored on your device. Local storage and session
          storage are browser technologies that can hold similar data. We use these tools
          to keep you signed in, protect the Service, and remember preferences.
        </p>
      </LegalSection>

      <LegalSection id="types" title="2. What we use">
        <p>The Service may use the following categories:</p>
        <ul>
          <li>
            <strong>Essential / authentication</strong> — Supabase and related session
            cookies required to log in, maintain secure sessions, and route requests
            correctly. The Service cannot function for registered users without these.
          </li>
          <li>
            <strong>Functional</strong> — settings or state stored in local storage to
            support practice flows, UI preferences, or similar non-advertising features
          </li>
          <li>
            <strong>Security</strong> — tokens or flags that help detect abuse and protect
            accounts
          </li>
        </ul>
        <p>
          We do not currently use third-party advertising or cross-site tracking cookies
          for marketing purposes. If that changes, we will update this policy.
        </p>
      </LegalSection>

      <LegalSection id="third-party" title="3. Third-party services">
        <p>
          Authentication and data hosting are provided by Supabase. Their services may set
          or read cookies and process technical logs according to their own policies. Our
          hosting provider may also set cookies or logs necessary for delivery and
          security.
        </p>
      </LegalSection>

      <LegalSection id="control" title="4. Your choices">
        <p>
          You can block or delete cookies through your browser settings. Blocking essential
          cookies may prevent sign-in or practice features from working. Clearing local
          storage may reset preferences stored on your device.
        </p>
        <p>
          To sign out and end an active session, use the log out control in the app header
          or clear site data for this domain in your browser.
        </p>
      </LegalSection>

      <LegalSection id="updates" title="5. Updates">
        <p>
          We may revise this Cookie Policy when our technology or providers change. Check
          the effective date at the top of this page for the latest version.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="6. Contact">
        <p>
          Questions about cookies:{" "}
          <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
        </p>
        <p>
          See also our <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/terms">Terms and Conditions</Link>.
        </p>
      </LegalSection>
    </>
  );
}
