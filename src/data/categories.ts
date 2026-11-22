import { CategoryDefinition, DifficultyLevel } from '../types/courtroom';

export function getDifficultyForLevel(level: number): DifficultyLevel {
  if (level <= 3) return 'Beginner';
  if (level <= 5) return 'Intermediate';
  if (level <= 7) return 'Advanced';
  if (level <= 9) return 'Expert';
  return 'Final Case';
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'campus',
    name: 'Campus Cases',
    shortName: 'Campus',
    description:
      'Investigate student impersonation, altered campus clips, fake accounts, and online reputation harm at colleges.',
    accentColor: '#E5B85C',
    badgeLabel: 'Campus Integrity',
    levels: [
      {
        levelNumber: 1,
        title: 'The Viral Confession',
        difficulty: 'Beginner',
        teaser: 'A leaked campus clip threatens a student election hours before voting opens.',
        playableCaseId: 'campus-viral-confession',
      },
      {
        levelNumber: 2,
        title: 'The Ghost Attendance Log',
        difficulty: 'Beginner',
        teaser: 'A forged screenshot accuses a lab leader of altering seminar records.',
      },
      {
        levelNumber: 3,
        title: 'Borrowed Voice Note',
        difficulty: 'Beginner',
        teaser: 'An audio clip in a dorm group chat sparks a dispute over exam leaks.',
      },
      {
        levelNumber: 4,
        title: 'The Cloned Club Account',
        difficulty: 'Intermediate',
        teaser: 'A lookalike student club profile collects fake event ticket fees.',
      },
      {
        levelNumber: 5,
        title: 'Edited Panel Debate',
        difficulty: 'Intermediate',
        teaser: 'A selectively cut debate clip goes viral across three universities.',
      },
      {
        levelNumber: 6,
        title: 'Synthetic Recommendation',
        difficulty: 'Advanced',
        teaser: 'A scholarship committee flags a suspicious digital letterhead and voice reference.',
      },
      {
        levelNumber: 7,
        title: 'The Midnight Press Release',
        difficulty: 'Advanced',
        teaser: 'A spoofed dean notice cancels finals and triggers campus-wide confusion.',
      },
      {
        levelNumber: 8,
        title: 'Coordinated Rumor Network',
        difficulty: 'Expert',
        teaser: 'Dozens of newly created student profiles amplify an altered protest photo.',
      },
      {
        levelNumber: 9,
        title: 'Deepfake Guest Lecture',
        difficulty: 'Expert',
        teaser: 'A live video call guest speaker turns out to be a real-time face overlay.',
      },
      {
        levelNumber: 10,
        title: 'The Campus Election Syndicate',
        difficulty: 'Final Case',
        teaser: 'Untangle a multi-channel disinformation campaign across video, chat, and flyers.',
      },
    ],
  },
  {
    id: 'financial',
    name: 'Financial Crimes',
    shortName: 'Financial',
    description:
      'Examine suspicious internship offers, fake job portals, invoice impersonation, and digital payment scams.',
    accentColor: '#4CC38A',
    badgeLabel: 'Financial Forensics',
    levels: [
      {
        levelNumber: 1,
        title: 'The Internship Trap',
        difficulty: 'Beginner',
        teaser: 'A high-paying remote tech offer asks for a refundable device deposit before day one.',
        playableCaseId: 'financial-internship-trap',
      },
      {
        levelNumber: 2,
        title: 'Urgent Tuition Refund',
        difficulty: 'Beginner',
        teaser: 'A spoofed bursar email promises an instant grant rebate via an external link.',
      },
      {
        levelNumber: 3,
        title: 'The Rental Key Deposit',
        difficulty: 'Beginner',
        teaser: 'An off-campus apartment listing uses stolen photos and high-pressure wire requests.',
      },
      {
        levelNumber: 4,
        title: 'Clone of the Payroll Portal',
        difficulty: 'Intermediate',
        teaser: 'Part-time staff receive a lookalike login page hours before direct deposit.',
      },
      {
        levelNumber: 5,
        title: 'The Freelance Escrow Scam',
        difficulty: 'Intermediate',
        teaser: 'A design student receives a fake payment confirmation receipt for a rush project.',
      },
      {
        levelNumber: 6,
        title: 'Voice-Cloned CFO Call',
        difficulty: 'Advanced',
        teaser: 'A startup treasurer receives an urgent audio call requesting an emergency vendor wire.',
      },
      {
        levelNumber: 7,
        title: 'The Crypto Mentor Stream',
        difficulty: 'Advanced',
        teaser: 'A deepfake livestream promises doubled returns during a product launch.',
      },
      {
        levelNumber: 8,
        title: 'Phantom Grant Foundation',
        difficulty: 'Expert',
        teaser: 'A fabricated nonprofit collects application fees using AI-generated board bios.',
      },
      {
        levelNumber: 9,
        title: 'Vendor Invoice Swap',
        difficulty: 'Expert',
        teaser: 'An altered PDF invoice silently redirects a club equipment payment offshore.',
      },
      {
        levelNumber: 10,
        title: 'The Synthetic Brokerage',
        difficulty: 'Final Case',
        teaser: 'Trace a layered financial fraud combining fake video advisors and shell domains.',
      },
    ],
  },
  {
    id: 'celebrity',
    name: 'Celebrity Cases',
    shortName: 'Celebrity',
    description:
      'Analyze fabricated public endorsements, AI-generated star interviews, and manipulated red-carpet clips.',
    accentColor: '#E05252',
    badgeLabel: 'Public Figure Media',
    levels: [
      {
        levelNumber: 1,
        title: 'The Miracle Supplement Endorsement',
        difficulty: 'Beginner',
        teaser: 'A beloved actor appears in a late-night ad they never filmed.',
      },
      {
        levelNumber: 2,
        title: 'Backstage Apology Clip',
        difficulty: 'Beginner',
        teaser: 'An audio clip of a singer criticizing fans spreads before a tour announcement.',
      },
      {
        levelNumber: 3,
        title: 'The Fake Charity Giveaway',
        difficulty: 'Beginner',
        teaser: 'A cloned verified handle runs a limited-time ticket raffle.',
      },
      {
        levelNumber: 4,
        title: 'Red Carpet Lip-Sync',
        difficulty: 'Intermediate',
        teaser: 'Subtle mouth edits turn a routine interview into a studio scandal.',
      },
      {
        levelNumber: 5,
        title: 'Synthetic Podcast Episode',
        difficulty: 'Intermediate',
        teaser: 'A viral 90-second podcast excerpt quotes a director who never appeared on the show.',
      },
      {
        levelNumber: 6,
        title: 'Altered Award Speech',
        difficulty: 'Advanced',
        teaser: 'Two versions of a broadcast acceptance speech circulate with conflicting remarks.',
      },
      {
        levelNumber: 7,
        title: 'The Phantom Biopic Trailer',
        difficulty: 'Advanced',
        teaser: 'An AI-assembled trailer tricks investors and fans into backing a fake film.',
      },
      {
        levelNumber: 8,
        title: 'Voice Clone Fan Club',
        difficulty: 'Expert',
        teaser: 'Personalized birthday messages from a musician are secretly sold by scammers.',
      },
      {
        levelNumber: 9,
        title: 'Dual-Angle Paparazzi Hoax',
        difficulty: 'Expert',
        teaser: 'Matched lighting and synthetic shadows stage an encounter that never happened.',
      },
      {
        levelNumber: 10,
        title: 'The Prime-Time Impostor',
        difficulty: 'Final Case',
        teaser: 'Dissect a full live-streamed celebrity impersonation tied to a charity drive.',
      },
    ],
  },
  {
    id: 'media',
    name: 'Media & News',
    shortName: 'Media & News',
    description:
      'Inspect viral headlines, out-of-context footage, edited news broadcasts, and misleading claims.',
    accentColor: '#60A5FA',
    badgeLabel: 'Media Verification',
    levels: [
      {
        levelNumber: 1,
        title: 'The Recycled Storm Video',
        difficulty: 'Beginner',
        teaser: 'Flood footage from five years ago resurfaces as breaking local news.',
      },
      {
        levelNumber: 2,
        title: 'Cropped Press Briefing',
        difficulty: 'Beginner',
        teaser: 'A 12-second clip omits the opening sentence that reverses its meaning.',
      },
      {
        levelNumber: 3,
        title: 'The Clone News Desk',
        difficulty: 'Beginner',
        teaser: 'A fake website mimics a respected regional newspaper down to the masthead.',
      },
      {
        levelNumber: 4,
        title: 'AI Anchor Broadcast',
        difficulty: 'Intermediate',
        teaser: 'A synthetic news anchor reads an alarming transit shutdown notice.',
      },
      {
        levelNumber: 5,
        title: 'Manipulated Chart Viral Post',
        difficulty: 'Intermediate',
        teaser: 'Truncated graph axes and edited labels distort public health data.',
      },
      {
        levelNumber: 6,
        title: 'The Fabricated Eyewitness',
        difficulty: 'Advanced',
        teaser: 'An unverified social account posts AI-generated street photos during an outage.',
      },
      {
        levelNumber: 7,
        title: 'Translated Out of Context',
        difficulty: 'Advanced',
        teaser: 'Auto-dubbed subtitles replace a speaker’s actual remarks in another language.',
      },
      {
        levelNumber: 8,
        title: 'Satellite Image Alteration',
        difficulty: 'Expert',
        teaser: 'Edited aerial imagery claims a regional bridge collapsed overnight.',
      },
      {
        levelNumber: 9,
        title: 'The Bot-Amplified Scoop',
        difficulty: 'Expert',
        teaser: 'Trace how a single unverified blog post became a trending headline in 20 minutes.',
      },
      {
        levelNumber: 10,
        title: 'Breaking News Mirage',
        difficulty: 'Final Case',
        teaser: 'Verify a chaotic emergency broadcast containing both genuine and fabricated clips.',
      },
    ],
  },
  {
    id: 'identity',
    name: 'Identity Crimes',
    shortName: 'Identity',
    description:
      'Uncover synthetic profiles, stolen credentials, fabricated professional histories, and account hijacking.',
    accentColor: '#A78BFA',
    badgeLabel: 'Identity Audit',
    levels: [
      {
        levelNumber: 1,
        title: 'The Mirror Profile',
        difficulty: 'Beginner',
        teaser: 'Someone copies a photographer’s portfolio and messages their clients.',
      },
      {
        levelNumber: 2,
        title: 'Borrowed Credentials',
        difficulty: 'Beginner',
        teaser: 'A fake medical advice account uses a real nurse’s headshot and license number.',
      },
      {
        levelNumber: 3,
        title: 'The Two-Face Resume',
        difficulty: 'Beginner',
        teaser: 'An online tutor’s profile photo fails basic background consistency checks.',
      },
      {
        levelNumber: 4,
        title: 'SIM Swap Takeover',
        difficulty: 'Intermediate',
        teaser: 'A creator’s account starts posting scams minutes after their phone loses signal.',
      },
      {
        levelNumber: 5,
        title: 'The Synthetic Reviewer',
        difficulty: 'Intermediate',
        teaser: 'Fifty five-star profiles share the same AI-generated face structure.',
      },
      {
        levelNumber: 6,
        title: 'Forged ID Verification',
        difficulty: 'Advanced',
        teaser: 'A marketplace seller submits an edited student ID card to gain trust.',
      },
      {
        levelNumber: 7,
        title: 'The Impostor Researcher',
        difficulty: 'Advanced',
        teaser: 'A fake academic invites students to share unpublished thesis drafts.',
      },
      {
        levelNumber: 8,
        title: 'Cross-Platform Persona',
        difficulty: 'Expert',
        teaser: 'A fabricated tech founder builds fake LinkedIn, GitHub, and press pages.',
      },
      {
        levelNumber: 9,
        title: 'Biometric Liveness Spoof',
        difficulty: 'Expert',
        teaser: 'Investigate how an attacker tried to bypass a selfie verification check.',
      },
      {
        levelNumber: 10,
        title: 'The Identity Broker',
        difficulty: 'Final Case',
        teaser: 'Connect a network of synthetic identities used across job and rental platforms.',
      },
    ],
  },
  {
    id: 'personal',
    name: 'Personal & Family',
    shortName: 'Personal',
    description:
      'Evaluate suspicious emergency calls, cloned family voice notes, and personal impersonation scams.',
    accentColor: '#F0B45A',
    badgeLabel: 'Family Safety',
    levels: [
      {
        levelNumber: 1,
        title: 'The Late-Night Voice Call',
        difficulty: 'Beginner',
        teaser: 'A grandparent gets a frantic call sounding like their grandson in trouble.',
      },
      {
        levelNumber: 2,
        title: 'New Number, Urgent Help',
        difficulty: 'Beginner',
        teaser: 'A message from an unknown number claims a sibling broke their phone abroad.',
      },
      {
        levelNumber: 3,
        title: 'The Cloned Family Photo',
        difficulty: 'Beginner',
        teaser: 'A relative’s hacked account shares an urgent medical fundraiser link.',
      },
      {
        levelNumber: 4,
        title: 'Airport Stranded Voice Note',
        difficulty: 'Intermediate',
        teaser: 'A 15-second voice memo asks for instant gift-card codes for a rebooked flight.',
      },
      {
        levelNumber: 5,
        title: 'The Romance Video Glitch',
        difficulty: 'Intermediate',
        teaser: 'An online acquaintance avoids live calls except for one oddly flickering clip.',
      },
      {
        levelNumber: 6,
        title: 'Neighborhood Group Alert',
        difficulty: 'Advanced',
        teaser: 'A spoofed neighbor account posts a fake delivery link to steal passwords.',
      },
      {
        levelNumber: 7,
        title: 'Fake Tech Support Callback',
        difficulty: 'Advanced',
        teaser: 'Caller ID displays a real bank number while pushing remote-access software.',
      },
      {
        levelNumber: 8,
        title: 'The Scraped Graduation Speech',
        difficulty: 'Expert',
        teaser: 'Public social media clips are used to clone a parent’s voice for a wire scam.',
      },
      {
        levelNumber: 9,
        title: 'Dual-Channel Family Trap',
        difficulty: 'Expert',
        teaser: 'Scammers coordinate both a spoofed text and a cloned voice note simultaneously.',
      },
      {
        levelNumber: 10,
        title: 'The Safe-Word Verification',
        difficulty: 'Final Case',
        teaser: 'Resolve a high-stakes family impersonation attempt using cross-channel forensics.',
      },
    ],
  },
];

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}
