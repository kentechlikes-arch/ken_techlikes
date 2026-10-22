/**
 * KEN_TECH LIKES - Platform Security & Compliance Constitution
 * Reserved Usernames, Prohibited Content Keywords, and Order Safety Guidelines
 */

// ============================================================================
// 1. RESERVED USERNAMES & BRAND IMPERSONATION TERMS
// ============================================================================
export const RESERVED_USERNAMES: string[] = [
  // System Administration & Privileges
  'admin',
  'administrator',
  'superadmin',
  'root',
  'sysadmin',
  'superuser',
  'moderator',
  'mod',
  'staff',
  'security',
  'dev',
  'developer',
  'master',
  'operator',

  // KEN_TECH Brand Identity & Official Representation
  'kentech',
  'kentechlikes',
  'ken_tech',
  'kentech_official',
  'kentechsupport',
  'kentechadmin',
  'kentech_support',
  'kentech_billing',
  'dukalalikes',
  'official',
  'verified',
  'support',
  'helpdesk',
  'customer_care',
  'desk',
  'billing',
  'finance',
  'payments',
  'mpesa',
  'safaricom',
  'safaricom_admin',
  'lipa_na_mpesa',

  // System & API Routes
  'api',
  'auth',
  'login',
  'register',
  'signup',
  'dashboard',
  'webhook',
  'system',
  'null',
  'undefined',
  'anonymous'
];

/**
 * Checks if a desired display name or username violates reserved brand identity terms
 */
export function isReservedUsername(rawName: string, allowedAdminUid?: string, currentUid?: string): {
  isReserved: boolean;
  reason?: string;
} {
  if (!rawName) return { isReserved: false };
  
  // If user is designated superadmin, allow official branding
  if (allowedAdminUid && currentUid && allowedAdminUid === currentUid) {
    return { isReserved: false };
  }

  const clean = rawName.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');

  for (const term of RESERVED_USERNAMES) {
    // Exact match or contains reserved core keyword as standalone token
    if (clean === term || clean.startsWith(`${term}_`) || clean.endsWith(`_${term}`) || clean === `the${term}`) {
      return {
        isReserved: true,
        reason: `The name "${rawName}" contains a protected system reserved term ("${term}"). Please select a unique username for your personal or agency account.`
      };
    }
  }

  return { isReserved: false };
}

// ============================================================================
// 2. PROHIBITED CONTENT KEYWORDS & URL PATTERNS
// ============================================================================
export const PROHIBITED_KEYWORDS: string[] = [
  // Adult & Sexually Explicit Content
  'porn',
  'xxx',
  'adultcam',
  'onlyfans-leak',
  'escort',
  'erotic',
  'nude',
  'nsfw',
  'stripclub',

  // Financial Scams & Illegal Operations
  'ponzi',
  'pyramid-scheme',
  'carding',
  'dumps-pin',
  'counterfeit',
  'fake-currency',
  'crypto-doubler',
  'hacked-accounts',
  'stolen-cards',
  'phishing',
  'malware',
  'trojan',

  // Violence, Extremism, Weapons & Illegal Substances
  'terror',
  'extremist',
  'explosives',
  'weapons-sales',
  'guns-for-sale',
  'ammunition-shop',
  'narcotics',
  'cocaine',
  'illicit-drugs',
  'darkweb',
  'hitman',

  // Coordinated Harassment & Cyberbullying
  'doxx',
  'doxxing',
  'defamation-hit',
  'revenge-porn',
  'suicide-pro',
  'self-harm'
];

/**
 * Validates a target link or order notes against prohibited terms and compliance criteria
 */
export function validateTargetLink(link: string): {
  isValid: boolean;
  error?: string;
  matchedCategory?: string;
} {
  if (!link || !link.trim()) {
    return { isValid: false, error: 'Target link is required.' };
  }

  const normalized = link.toLowerCase().trim();

  // Basic URL sanity
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://') && !normalized.startsWith('www.')) {
    // Allow pure usernames like @username for TikTok/Instagram or t.me/channel
    if (!normalized.startsWith('@') && !normalized.includes('.')) {
      return {
        isValid: false,
        error: 'Please enter a valid URL (e.g. https://www.tiktok.com/@username/video/...) or public @handle.'
      };
    }
  }

  // Scan against prohibited terms
  for (const keyword of PROHIBITED_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        isValid: false,
        error: `Submission rejected: Target link contains restricted/prohibited term ("${keyword}"). KEN_TECH LIKES strictly prohibits promotion of explicit, fraudulent, or harmful content.`,
        matchedCategory: 'Prohibited Content'
      };
    }
  }

  // Prohibit local / loopback / private IP exploits
  if (
    normalized.includes('127.0.0.1') || 
    normalized.includes('localhost') || 
    normalized.includes('192.168.') || 
    normalized.includes('10.0.')
  ) {
    return {
      isValid: false,
      error: 'Invalid target address: Local and private network links cannot receive social media engagement.'
    };
  }

  return { isValid: true };
}

// ============================================================================
// 3. COMPREHENSIVE TERMS & POLICY CHAPTERS
// ============================================================================
export interface PolicySection {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  summary: string;
  rules: Array<{
    heading: string;
    description: string;
    isStrict?: boolean;
  }>;
}

export const PLATFORM_POLICIES: PolicySection[] = [
  {
    id: 'prohibited-content',
    title: '1. Prohibited Content & Zero-Tolerance Guidelines',
    badge: 'Strict Enforcement',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    summary: 'KEN_TECH LIKES maintains high integrity standards compliant with Kenyan Cybercrime Regulations & global social media API terms. Orders promoting illegal or harmful niches will be immediately cancelled without refund.',
    rules: [
      {
        heading: 'Adult & Sexually Explicit Media',
        description: 'Pornography, sexually suggestive materials involving minors (zero tolerance / immediate law enforcement escalation), adult webcam operations, and escort solicitation are strictly banned.',
        isStrict: true
      },
      {
        heading: 'Financial Deception & Cyber Fraud',
        description: 'Ponzi schemes, pyramid schemes, fake M-Pesa reversal services, crypto-doubler operations, phishing portals, and counterfeit currency pages are completely prohibited from receiving engagement.',
        isStrict: true
      },
      {
        heading: 'Violence, Extremism & Hate Speech',
        description: 'Terrorist recruitment, graphic physical violence, illegal weapons/firearms trafficking, illicit drug trade, coordinated cyberbullying, and hate speech targeting ethnic, religious, or minority groups are prohibited.',
        isStrict: true
      },
      {
        heading: 'Defamation & Non-Consensual Doxxing',
        description: 'Using promotional campaigns to artificially amplify defamatory claims, non-consensual personal documents, or harassment targets will result in immediate permanent account termination.',
        isStrict: true
      }
    ]
  },
  {
    id: 'reserved-terms',
    title: '2. Reserved Names & Brand Integrity',
    badge: 'Account Integrity',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    summary: 'To protect clients and prevent phishing or administrative impersonation, certain terms are strictly reserved for official system operations.',
    rules: [
      {
        heading: 'System & Admin Impersonation',
        description: 'Usernames containing "admin", "administrator", "superadmin", "moderator", "root", or "sysadmin" are reserved exclusively for authorized system personnel.',
        isStrict: true
      },
      {
        heading: 'Brand Names & Official Channels',
        description: 'Names including "kentech", "kentechlikes", "dukalalikes", "safaricom_desk", "lipa_na_mpesa", or "official_support" cannot be registered by standard clients.',
        isStrict: true
      },
      {
        heading: 'Misleading Agency Names',
        description: 'Accounts found posing as payment processors or Safaricom customer representatives to deceive other users will have all associated funds frozen.'
      }
    ]
  },
  {
    id: 'order-execution',
    title: '3. Order Fulfillment & Public Profile Requirements',
    badge: 'Fulfillment Rules',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    summary: 'Ensuring your social accounts are properly configured prevents server conflicts and guarantees seamless delivery.',
    rules: [
      {
        heading: 'Accounts Must Remain 100% Public',
        description: 'Never make your profile private while an active order is delivering. Private accounts block server delivery nodes and automatically void refill guarantees.',
        isStrict: true
      },
      {
        heading: 'Do Not Change Usernames During Delivery',
        description: 'If you change your TikTok, Instagram, or YouTube handle while an order is processing, the automated tracking node loses synchronization and the order will finish prematurely.',
        isStrict: true
      },
      {
        heading: 'No Simultaneous Double Ordering on Same Link',
        description: 'Wait for an existing order on a specific video, reel, or post to show "Completed" before placing a second order on the exact same link. Running overlapping orders causes counter overlaps and voids dispute claims.',
        isStrict: true
      }
    ]
  },
  {
    id: 'payment-integrity',
    title: '4. M-Pesa Payment Integrity & Reversal Policy',
    badge: 'Financial Compliance',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    summary: 'Direct integration with Safaricom Lipa Na M-Pesa requires transparent financial integrity from all account holders.',
    rules: [
      {
        heading: 'Prohibition of Fraudulent M-Pesa Reversals',
        description: 'Attempting to request a Safaricom M-Pesa reversal after social growth units have been credited or delivered to your profile is classified as theft of digital service. Violating accounts are blacklisted across all Kenyan SMM reseller databases.',
        isStrict: true
      },
      {
        heading: 'Submission of Real Transaction Codes Only',
        description: 'Submitting forged or duplicate M-Pesa SMS receipt references into the automated validator will trigger an automatic temporary security freeze on your account.',
        isStrict: true
      },
      {
        heading: 'Deposit Refunds',
        description: 'Unspent wallet balances may be refunded upon formal support ticket review after identity verification back to the original funding Safaricom phone line.'
      }
    ]
  },
  {
    id: 'refill-warranty',
    title: '5. 30-Day Auto Refill & Quality Guarantee',
    badge: 'Warranty Policy',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    summary: 'KEN_TECH LIKES guarantees stability on all services marked with our Refill Guarantee seal.',
    rules: [
      {
        heading: '30-Day Automated Refill Coverage',
        description: 'If your subscriber, follower, or like count drops below the ordered start + target threshold, click "Request Refill" in your Order Tracker or contact support for a free replenishment.',
        isStrict: false
      },
      {
        heading: 'Warranty Void Conditions',
        description: 'Refill warranties are voided if the target profile was switched to private, the link was deleted, or a third-party non-drop panel was used on the same link concurrently.',
        isStrict: false
      }
    ]
  }
];
