import Link from "next/link";
import { LegalSection } from "@/components/legal/LegalSection";
import { LEGAL_CONFIG } from "@/lib/legal/constants";
import { SITE_CONFIG } from "@/lib/seo/config";

export function PrivacyContent() {
  const { effectiveDate, effectiveDateIso, supportEmail, legalEmail } = LEGAL_CONFIG;

  return (
    <>
      <header className="legal-page-header">
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-page-lead">
          This policy describes how {SITE_CONFIG.name} collects, uses, and protects
          information when you use our educational DMV practice platform.
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

      <LegalSection id="overview" title="1. Overview" variant="highlight">
        <p>
          {SITE_CONFIG.name} provides practice tests and study tools. We process only the
          data needed to run accounts, save your progress, secure the Service, and improve
          study features.
        </p>
        <p>
          We are not affiliated with any DMV or state licensing authority. This policy
          applies to visitors and registered users of the Service.
        </p>
      </LegalSection>

      <LegalSection id="collect" title="2. Information we collect">
        <p>Depending on how you use the Service, we may collect:</p>
        <ul>
          <li>
            <strong>Account information</strong> — email address and authentication
            identifiers when you register or sign in (via Supabase Auth)
          </li>
          <li>
            <strong>Practice data</strong> — test attempts, scores, missed questions, home
            state selection, and related study activity stored in our database
          </li>
          <li>
            <strong>Technical data</strong> — IP address, browser type, device information,
            and server logs used for security and troubleshooting
          </li>
          <li>
            <strong>Local storage</strong> — preferences or session-related data stored in
            your browser to support sign-in and app functionality
          </li>
        </ul>
        <p>
          We do not intentionally collect sensitive categories such as government ID
          numbers, payment card data (unless you later use a paid feature), or precise
          geolocation for advertising.
        </p>
      </LegalSection>

      <LegalSection id="use" title="3. How we use information">
        <p>We use collected information to:</p>
        <ul>
          <li>Authenticate users and maintain account security</li>
          <li>Store and display your practice progress and test history</li>
          <li>Operate, maintain, and improve questions, explanations, and features</li>
          <li>Respond to support requests and enforce our Terms</li>
          <li>Detect abuse, fraud, scraping, or technical issues</li>
        </ul>
      </LegalSection>

      <LegalSection id="sharing" title="4. How we share information">
        <p>
          We do not sell your personal information. We may share data with service
          providers that help us run the Service, including:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> — authentication, database hosting, and related
            infrastructure
          </li>
          <li>
            <strong>Hosting providers</strong> — application delivery and security (e.g.,
            Vercel or similar)
          </li>
        </ul>
        <p>
          These providers process data on our behalf under contractual obligations. We may
          also disclose information if required by law or to protect rights, safety, and
          security.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="5. Retention">
        <p>
          We retain account and practice data while your account is active and for a
          reasonable period afterward, unless you request deletion or we are required to
          retain records by law.
        </p>
        <p>
          You may request account deletion by contacting{" "}
          <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="6. Your choices and rights">
        <p>
          You can update account details through your profile or authentication provider
          where available. You may opt out of non-essential communications and request
          access, correction, or deletion of personal data subject to applicable law.
        </p>
        <p>
          California and certain other residents may have additional rights under local
          privacy laws. Contact us to exercise those rights.
        </p>
      </LegalSection>

      <LegalSection id="children" title="7. Children">
        <p>
          The Service is not directed to children under 13. We do not knowingly collect
          personal information from children under 13. If you believe we have done so,
          contact us and we will delete it promptly.
        </p>
      </LegalSection>

      <LegalSection id="security" title="8. Security">
        <p>
          We use industry-standard measures such as encrypted connections (HTTPS) and
          access controls through our hosting and database providers. No method of
          transmission or storage is completely secure.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="9. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be
          reflected by updating the effective date above. Continued use after changes
          means you accept the updated policy.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="10. Contact">
        <p>
          Privacy questions:{" "}
          <a href={`mailto:${legalEmail}`}>{legalEmail}</a>
          <br />
          General support:{" "}
          <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
        </p>
        <p>
          See also our <Link href="/cookies">Cookie Policy</Link> and{" "}
          <Link href="/terms">Terms and Conditions</Link>.
        </p>
      </LegalSection>
    </>
  );
}
