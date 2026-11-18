# TechStore Pro — Nigerian Counsel Legal-Readiness Brief

**Status: PRIVILEGED / CONFIDENTIAL REVIEW MATERIAL — DRAFT FOR COUNSEL, NOT LEGAL ADVICE OR AN APPROVED LICENSE**

**Repository:** `JohnkayFundz/techstore-pro`  
**Review branch:** `qa/customer-e2e`  
**Commercial release decision:** 🔴 HOLD  
**Prepared:** 18 November 2026

## 1. Purpose and instructions to counsel

Please review the proposed commercial licensing model and the third-party software-notice package before any commercial offer, archive distribution, or marketplace publication. Please identify required amendments, evidence, registrations, notices, and operational changes under Nigerian law and any relevant buyer-jurisdiction or marketplace rules.

This brief records questions for advice. It does not assert that the proposed terms are enforceable, that the seller has completed every legal formality, or that any third-party license obligations have been discharged.

## 2. Documents presented for review

| Document | Current repository reference | Status |
|---|---|---|
| `COMMERCIAL_LICENSE_DRAFT.md` | QA blob SHA `f2e6ed6e497b82fb26d1bcd153711598de2995c6` | Proposed v1.0; not approved for sale |
| `THIRD-PARTY-NOTICES.md` | QA blob SHA `91da45a774cd634030f863713ccfc1422cbfa047` | Automated collection marked complete; human/legal review outstanding |
| `RELEASE_READINESS.md` | QA blob SHA `29ed414168d3e488814836a89444c76c783516c6` | Release remains on security and commercial HOLD |

The notices register reports **296 production package entries** and **zero unresolved collection entries**. The broader exact-lockfile review has identified 582 package records across root and backend lockfiles, including development/build-time dependencies. The actual distributable archive has not been generated or inspected; counsel should not assume that every lockfile record is shipped or that the current notice file alone proves archive compliance.

## 3. Seller identity, capacity and business status

The draft identifies the proposed licensor as **John Kalumba, trading as JohnKay Fundz**, acting as an individual/sole proprietor in Lagos State, Nigeria. The seller has stated that JohnKay Fundz is not currently a CAC-registered company or registered business name.

Please advise:

1. Is it legally appropriate to contract in the individual's personal capacity using the trading style “JohnKay Fundz” in the proposed form?
2. Is CAC business-name registration, another registration, tax registration, or any other formal step required or advisable before offering this software commercially?
3. What exact legal name, trading-style wording, registration identifiers (if any), tax details, and seller disclosures should appear on the license, invoice, marketplace profile, and website?
4. What evidence should be retained to substantiate the seller's authority to license the original code and bespoke assets?
5. Are there material liability, tax, consumer-protection, or record-keeping consequences of operating as an unregistered sole proprietor?

## 4. Service address and formal notices

The draft currently gives Lagos, Nigeria as a general correspondence location and `johnkayfundz@gmail.com` as the support email. It intentionally does not publish a residential street address. A formal service/notice address has not been supplied.

Please advise on the legal sufficiency, availability, and risks of each possible arrangement, without assuming any is acceptable:

- a physical business or service address used with permission;
- a registered office or business address, if applicable;
- a commercial virtual business address with documented mail receipt and forwarding;
- a P.O. Box or private-mailbox address;
- an address of a solicitor or other authorized agent for service, if permitted; or
- another legally recognized electronic or physical notice method.

For each viable option, please specify whether it can be used for contractual notices, consumer disclosures, marketplace seller verification, regulatory correspondence, and court process. Please distinguish an address for ordinary correspondence from a legally valid address for service of proceedings. Please also advise on privacy-safe publication and what evidence/consent must be retained.

## 5. Proposed buyer rights, restrictions and source deletion

The draft proposes one commercial or internal storefront/web application for the buyer or one named client, limited backup/development/staging copies for that end product, contractor access subject to written confidentiality and non-redistribution terms, and a one-time client handover where the buyer retains no source copies.

Please review:

1. Whether the single-end-product scope, restrictions on standalone source/template redistribution, and limits on multi-tenant SaaS or multiple storefronts are sufficiently clear and enforceable.
2. Whether the one-time named-client license transfer is properly structured, including whether the client must expressly accept the license and whether any assignment/novation or additional consent is required.
3. Whether contractor access and the requirement to delete source copies on completion are workable and enforceable.
4. What exceptions are required for statutory record retention, legal holds, backups, disaster recovery, security logs, professional advisers, and evidence needed to establish compliance.
5. Whether the deletion obligation should require written certification, a deadline, and treatment of inaccessible routine backups.
6. Whether the proposed restrictions conflict with mandatory rights, interoperability rules, exhaustion, reverse-engineering exceptions, or other non-waivable rights.

Please propose precise replacement wording where necessary.

## 6. Support, defects, refunds and consumer rights

The draft proposes 30 days of basic installation/setup support and defect fixes for reproducible defects in the unmodified delivered codebase that prevent documented core storefront or checkout functionality. It proposes a two-business-day response target, email-only support, and a 14-calendar-day refund policy for qualifying reproducible defects or material mismatch. It states that mandatory statutory and marketplace rights prevail.

Please advise:

1. Which Nigerian consumer-protection, e-commerce, data-protection, and other mandatory rules apply to sales of downloadable software to consumers and business buyers?
2. Can the proposed 14-day refund period and stated exclusions lawfully operate as drafted? Which rights cannot be excluded, and what disclosures or remedies must be added?
3. Are the 30-day defect-fix scope, response target, exclusions, and “unmodified delivered codebase” wording sufficiently clear?
4. What remedies, time limits, evidence standards, and escalation process should apply to defective or materially misdescribed digital content?
5. What additional disclosures are required for a demo checkout that does not itself promise functioning card-payment processing?
6. What terms are required for cross-border sales, marketplace transactions, chargebacks, taxes, currency, governing law, and mandatory buyer-local consumer protections?

## 7. Third-party software notices and license compatibility

The generated notices file is an automated collection from exact root/backend lockfiles and installed package contents. It includes package-specific license/notice material and nested vendor notices. Collection completeness is not an independent legal conclusion.

Please review the exact versions and texts in the repository and advise what must be included in the delivered archive, documentation, UI attribution, source distribution, or other accompanying materials. Particular attention is requested for:

- **MPL-2.0:** `lightningcss@1.33.0` and 11 platform packages (12 records). Determine whether any covered files are modified, combined, or distributed in a way that triggers source-code availability, notice, or file-level copyleft obligations. Specify the required source offer and delivery mechanism, if any.
- **CC-BY-4.0:** `caniuse-lite@1.0.30001826`. Confirm attribution, license-link, modification indication, and placement requirements if the material is included in a distributed product.
- **BlueOak-1.0.0:** 12 root development records. Confirm the exact license terms and whether these packages or their material are present in the final buyer deliverable.
- **Unlicense:** `big-integer@1.6.52` and `stream-buffers@2.2.0`. Confirm the applicable text, copyright/notice retention, and any jurisdictional uncertainty or fallback treatment.
- **0BSD:** root production `tslib@2.8.1` and backend development `tslib@2.9.1`. Confirm exact obligations and whether each is shipped or build-only.
- **`victory-vendor@37.3.6`:** lockfile metadata identifies MIT AND ISC, while the generated collection also retains nested BSD-3-Clause D3 vendor notices. Determine the full applicable notice set and exactly how it must accompany any archive.
- **`busboy@1.6.0` and `streamsearch@1.1.0`:** backend metadata lacks a modern SPDX expression; exact-version MIT license texts are retained at `licenses/busboy-1.6.0-LICENSE.txt` and `licenses/streamsearch-1.1.0-LICENSE.txt`. Confirm the correct license identification and notice requirements.

Please also review the complete 296-entry production notice register and identify any additional licenses, attribution/copyright headers, patent clauses, source-disclosure obligations, trademark conditions, or incompatibilities requiring action. Distinguish dependencies actually shipped to buyers from build/test-only dependencies after the final package contents are known. Do not infer distribution scope from the lockfiles alone.

## 8. Ownership, provenance and asset evidence

The seller represents that original application source, architecture, custom UI components, and bespoke SVG/graphic assets were created exclusively by the seller. The draft expressly says this is a seller representation, not an independent forensic or legal audit.

Please advise what evidence is needed to support this representation, including repository history, contributor records, design/source files, asset provenance, font/icon/media licenses, and any third-party code or generated content. Please identify any wording that should be narrowed or qualified to avoid an unsupported warranty.

## 9. Contract clauses still requiring counsel drafting

The draft itself identifies warranties, liability, indemnity, and termination as unfinished. Please draft or recommend appropriate provisions for:

- express and implied warranties and permitted disclaimers;
- limitation/exclusion of liability, caps, carve-outs, and non-excludable liability;
- indemnities and claim procedure;
- suspension, termination, breach, cure periods, and post-termination effects;
- confidentiality, privacy, security, and personal-data responsibilities;
- dispute resolution, governing law, jurisdiction, service of notices, and cross-border enforcement;
- severability, entire agreement, amendments, assignment, force majeure, and electronic acceptance;
- versioning, updates, support changes, and product withdrawal.

Please assess the proposed Nigerian law and Lagos State courts clauses against mandatory law and the likely location of buyers. Recommend any marketplace-specific terms that must take precedence.

## 10. Counsel deliverables requested

Please provide:

1. A written issue list classifying each point as **required before first sale**, **required before archive distribution**, **recommended**, or **not applicable**.
2. Redlined and clean final license text, including completed warranty, liability, indemnity, termination, notices, refund, and governing-law clauses.
3. A written opinion on seller identity/capacity, business-registration implications, and an acceptable formal service/notice arrangement.
4. A third-party license compliance matrix mapping each shipped package/asset to exact version, license, required notice/attribution/source action, and archive location.
5. A list of any missing evidence, permissions, registrations, or operational controls.
6. Confirmation of any buyer-jurisdiction or marketplace terms that override the proposed license.

## 11. Release controls and current non-authorizations

The project remains on **🔴 HOLD** because the root build-tool dependency audit reports a high-severity `picomatch@4.0.7` advisory with no verified upstream patched release established in the current investigation.

This legal review request does **not** authorize:

- changing or bypassing the dependency audit gate;
- merging QA into `main` or updating `main`;
- production deployment or production database/configuration changes;
- enabling live payments;
- generating, signing, or distributing a buyer archive;
- publishing a marketplace listing or making a commercial offer;
- treating automated notices collection as legal clearance.

The main branch baseline remains `4713a3506ba64036b16768a3713bc4956d000fb4`. Any later release consideration requires a separately documented security resolution, counsel's written clearance, exact archive-specific license review, clean CI, and explicit authorization for the relevant release actions.

---

**Prepared for qualified Nigerian legal counsel. No legal opinion is expressed by this document.**
