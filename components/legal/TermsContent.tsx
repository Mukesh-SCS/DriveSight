import Link from "next/link";
import { LegalSection } from "@/components/legal/LegalSection";
import { LEGAL_CONFIG } from "@/lib/legal/constants";
import { SITE_CONFIG } from "@/lib/seo/config";

export function TermsContent() {
  const {
    effectiveDate,
    effectiveDateIso,
    governingState,
    supportEmail,
    legalEmail,
  } = LEGAL_CONFIG;

  return (
    <>
      <header className="legal-page-header">
        <p className="eyebrow">Legal</p>
        <h1>Terms and Conditions</h1>
        <p className="legal-page-lead">
          Please read these terms carefully before using {SITE_CONFIG.name}. They explain
          what our practice platform offers, what we do not guarantee, and how you may use
          the service.
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

      <nav aria-label="Terms sections" className="legal-toc">
        <p className="legal-toc-label">On this page</p>
        <ol>
          <li>
            <a href="#agreement">Agreement to terms</a>
          </li>
          <li>
            <a href="#eligibility">Eligibility</a>
          </li>
          <li>
            <a href="#disclaimer">Educational disclaimer</a>
          </li>
          <li>
            <a href="#acceptable-use">Acceptable use</a>
          </li>
          <li>
            <a href="#accounts">Accounts</a>
          </li>
          <li>
            <a href="#intellectual-property">Intellectual property</a>
          </li>
          <li>
            <a href="#privacy">Privacy</a>
          </li>
          <li>
            <a href="#limitation">Limitation of liability</a>
          </li>
          <li>
            <a href="#changes">Changes to the service</a>
          </li>
          <li>
            <a href="#governing-law">Governing law</a>
          </li>
          <li>
            <a href="#dispute-resolution">Dispute resolution</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ol>
      </nav>

      <LegalSection id="agreement" title="1. Agreement to terms" variant="highlight">
        <p>
          By accessing or using {SITE_CONFIG.name} (the &quot;Service&quot;), you agree to
          these Terms and Conditions (&quot;Terms&quot;). If you do not agree, do not use
          the Service.
        </p>
        <p>
          {SITE_CONFIG.name} is operated as an independent educational practice platform.
          These Terms form a binding agreement between you and the operator of{" "}
          {SITE_CONFIG.name}.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="2. Eligibility">
        <p>
          You must be at least <strong>13 years old</strong> to use the Service. If you are
          under 18, you should use the Service only with permission from a parent or legal
          guardian who agrees to these Terms on your behalf.
        </p>
        <p>
          By using the Service, you represent that you meet this age requirement and that
          the information you provide during registration is accurate.
        </p>
      </LegalSection>

      <LegalSection id="disclaimer" title="3. Educational disclaimer">
        <p>
          <strong>{SITE_CONFIG.name} is for study and practice purposes only.</strong> We
          provide learner permit and DMV-style practice questions, explanations, road sign
          references, and related study tools to help you prepare for written knowledge
          tests.
        </p>
        <ul>
          <li>
            <strong>No government affiliation.</strong> {SITE_CONFIG.name} is not affiliated
            with, endorsed by, or sponsored by any state Department of Motor Vehicles
            (DMV), motor vehicle agency, licensing authority, or other government body.
          </li>
          <li>
            <strong>No exam guarantee.</strong> Passing practice tests on {SITE_CONFIG.name}{" "}
            does <strong>not</strong> guarantee passing any official permit test, learner
            license exam, renewal test, or other examination administered by a government
            agency. We do not guarantee any particular score, outcome, or license approval.
            Your results depend on your preparation, the official test you take, and
            current state requirements.
          </li>
          <li>
            <strong>Automated and generated content.</strong> Some questions, explanations,
            and study materials may be generated or assisted by automated systems and
            should not be considered official DMV content. Always verify answers against
            your state&apos;s current driver handbook and official sources.
          </li>
          <li>
            <strong>Verify official sources.</strong> Laws, fines, passing scores, and test
            formats change. You are responsible for confirming requirements with your
            state&apos;s official driver handbook, licensing office, or authorized
            provider before testing or driving.
          </li>
          <li>
            <strong>Content may be outdated.</strong> Practice materials are updated from
            time to time, but they may not reflect the latest statutes, administrative
            rules, or exam revisions in every state.
          </li>
          <li>
            <strong>Not legal or professional advice.</strong> Nothing on the Service
            constitutes legal advice, driving instruction, or professional licensing
            guidance.
          </li>
        </ul>
        <p>
          You use the Service at your own risk. We are not responsible for failed tests,
          license penalties, fines, accidents, insurance outcomes, employment decisions, or
          other consequences that may arise from your use of the Service or from driving
          decisions you make on the road.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="4. Acceptable use">
        <p>You agree to use the Service lawfully and respectfully. You must not:</p>
        <ul>
          <li>
            Scrape, crawl, bulk download, or automatically extract questions, answers, or
            other content without written permission
          </li>
          <li>
            Copy, redistribute, resell, sublicense, or publicly republish our content except
            as allowed by these Terms or applicable law
          </li>
          <li>
            Attempt to cheat, manipulate scoring, reverse engineer protected features, or
            interfere with the security or performance of the Service
          </li>
          <li>
            Use the Service to harass others, distribute malware, or engage in fraudulent
            or abusive activity
          </li>
          <li>
            Misrepresent your affiliation with {SITE_CONFIG.name} or any government agency
          </li>
          <li>
            Share account credentials in a way that violates our account policies or
            applicable law
          </li>
        </ul>
        <p>
          We may investigate suspected abuse and suspend or terminate access, with or
          without notice, when we reasonably believe these Terms have been violated.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="5. Accounts">
        <p>
          Some features require an account. You are responsible for keeping your login
          credentials confidential and for activity that occurs under your account.
        </p>
        <p>
          You agree to provide accurate registration information and to update it when
          needed. We may suspend or close accounts that are inactive, compromised, abusive,
          or used in violation of these Terms.
        </p>
      </LegalSection>

      <LegalSection id="intellectual-property" title="6. Intellectual property">
        <p>
          The Service, including its software, design, branding, question banks,
          explanations, graphics, and compiled content, is owned by {SITE_CONFIG.name} or
          its licensors and is protected by copyright, trademark, and other intellectual
          property laws.
        </p>
        <p>
          We grant you a limited, personal, non-exclusive, non-transferable license to
          access and use the Service for your own study. That license does not allow you to
          copy, modify, distribute, or create derivative works from our content except as
          expressly permitted.
        </p>
        <p>
          &quot;DriveSight&quot; and related marks are trademarks of the Service operator.
          Other names and marks appearing on the Service belong to their respective owners.
        </p>
      </LegalSection>

      <LegalSection id="privacy" title="7. Privacy">
        <p>
          Your use of the Service is also subject to our{" "}
          <Link href="/privacy">Privacy Policy</Link> and <Link href="/cookies">Cookie Policy</Link>.
          We collect and use information such as account details (via Supabase Auth),
          practice history, session cookies, browser storage, and technical logs to operate
          and improve the platform.
        </p>
        <p>
          For privacy-related questions, contact{" "}
          <a href={`mailto:${legalEmail}`}>{legalEmail}</a>. For account or product help,
          contact <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection id="limitation" title="8. Limitation of liability">
        <p>
          To the fullest extent permitted by applicable law, the Service is provided on
          an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any
          kind, whether express or implied, including implied warranties of
          merchantability, fitness for a particular purpose, accuracy, or non-infringement.
        </p>
        <p>
          To the maximum extent permitted by law, {SITE_CONFIG.name} and its operators,
          affiliates, and suppliers will not be liable for any indirect, incidental,
          special, consequential, or punitive damages, or for any loss of profits, data,
          goodwill, or other intangible losses, arising from:
        </p>
        <ul>
          <li>Your access to or use of, or inability to access or use, the Service</li>
          <li>Any conduct or content of third parties on or through the Service</li>
          <li>
            Unauthorized access, use, or alteration of your transmissions or account
            information
          </li>
          <li>
            Reliance on practice materials, explanations, or study recommendations
          </li>
        </ul>
        <p>
          To the fullest extent permitted by law, our total liability for any claim
          relating to the Service will not exceed the amount paid by you, if any, for use
          of the Service in the twelve months before the claim arose.
        </p>
        <p>
          Some jurisdictions do not allow certain limitations. In those cases, our
          liability is limited to the minimum extent allowed by law.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="9. Changes to the service and terms">
        <p>
          We may update questions, features, pricing (if introduced), and these Terms from
          time to time. We may add, change, or remove content without prior notice.
        </p>
        <p>
          When we make material changes to these Terms, we will update the effective date
          at the top of this page. Continued use of the Service after changes become
          effective constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="10. Governing law">
        <p>
          These Terms are governed by the laws of the State of {governingState}, without
          regard to conflict-of-law principles, except where mandatory consumer protection
          laws in your place of residence apply.
        </p>
      </LegalSection>

      <LegalSection id="dispute-resolution" title="11. Dispute resolution">
        <p>
          If you have a concern about the Service or these Terms, please contact us first
          at <a href={`mailto:${legalEmail}`}>{legalEmail}</a> so we can try to resolve it
          informally.
        </p>
        <p>
          Except where prohibited by law, any dispute that cannot be resolved informally
          within thirty (30) days may be brought in the state or federal courts located in{" "}
          {governingState}, and you consent to the personal jurisdiction and venue of those
          courts.
        </p>
        <p>
          Nothing in this section prevents either party from seeking injunctive or other
          equitable relief for misuse of intellectual property or unauthorized access to
          the Service.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="12. Contact">
        <p>
          Questions about these Terms:{" "}
          <a href={`mailto:${legalEmail}`}>{legalEmail}</a>
        </p>
        <p>
          Product support: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
        </p>
        <p>
          Related policies: <Link href="/privacy">Privacy Policy</Link>
          <span aria-hidden="true"> · </span>
          <Link href="/cookies">Cookie Policy</Link>
        </p>
      </LegalSection>
    </>
  );
}
