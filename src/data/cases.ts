import { CaseDefinition } from '../types/courtroom';

export const CASES: CaseDefinition[] = [
  {
    id: 'campus-viral-confession',
    caseCode: 'CASE-01',
    categoryId: 'campus',
    levelNumber: 1,
    title: 'The Viral Confession',
    difficulty: 'Beginner',
    incidentDate: 'October 14',
    estimatedMinutes: 3,
    baseXp: 150,
    heroImage: '/src/assets/images/evidence_campus_video_1795245122812.jpg',
    shortHook:
      'A short video of student Arjun insulting classmates spreads overnight before the campus election. Is the video real or faked?',
    summary:
      'The night before the Student Council election at Northbridge College, a 28-second video goes viral in the campus group chat. It looks like frontrunner Arjun Mehta standing outside the library at 7:20 PM, making rude remarks about first-year students. Many classmates are upset, but Arjun says he was inside the Robotics Lab the whole time and never made that video.',
    disputedClaim:
      'Did Arjun Mehta really film this insulting video outside the library around 7:20 PM?',
    objective:
      'Read the 5 short clues below, spot what does not add up, and decide if the video is Authentic, Manipulated, or Not Enough Evidence.',
    characters: [
      {
        name: 'Arjun Mehta',
        role: 'Student Candidate',
        note: 'Says he stopped by the library for coffee at 6:30 PM, then worked in the Robotics Lab from 7:05 PM to 8:10 PM.',
      },
      {
        name: 'Riya Kapoor',
        role: 'Classmate',
        note: 'Campaigns for Arjun’s rival. Says she saw Arjun in his dark hoodie near the library that evening.',
      },
      {
        name: 'Prof. Hannah Lin',
        role: 'Robotics Lab Teacher',
        note: 'Was in the Robotics Lab all evening with Arjun’s team.',
      },
    ],
    requiredEvidenceCount: 3,
    evidence: [
      {
        id: 'cmp-ev-1',
        section: 'media',
        cardLabel: 'Video Clue',
        title: 'The Viral Video Clip',
        subtitle: '28-second clip filmed outside Miller Library at dusk',
        source: 'Campus Group Chat',
        timestamp: 'Oct 14 · 9:10 PM',
        summary:
          'At first glance, the video looks very believable. It sounds like Arjun, and he is wearing his usual dark hoodie. Look closer at the lighting and audio.',
        keyTakeaway:
          'Arjun’s face has bright warm indoor light on it even though the sky behind him is dark blue, and the wind sound cuts out right when the insult starts.',
        expectedClassifications: ['suspicious'],
        isKeyClue: true,
        mediaData: {
          imageUrl: '/src/assets/images/evidence_campus_video_1795245122812.jpg',
          imageAlt:
            'Video still of a student in a dark hoodie outside a brick college library at dusk',
          mediaLabel: 'Viral Clip · Frame 0:15',
          duration: '28 sec',
          caption: 'The speaker looks like Arjun outside the library at dusk.',
          transcript: [
            {
              time: '0:04',
              text: '"People keep asking why I care about the first-year meeting..."',
            },
            {
              time: '0:15',
              text: '"...half those scholarship kids only vote for free pizza anyway."',
              note: 'His lips lag slightly behind the words, and outdoor wind noise suddenly goes silent.',
            },
          ],
          hotspots: [
            {
              id: 'hs-1',
              timestampOrRegion: 'Lighting on Face',
              title: 'Indoor Light Outside',
              finding:
                'The courtyard behind him is dim and cool blue, yet his face has bright warm light like an indoor studio.',
            },
            {
              id: 'hs-2',
              timestampOrRegion: 'Sound at 0:15',
              title: 'Sudden Silence in Wind',
              finding:
                'Outdoor street and wind noise drops to total silence right during the offensive sentence.',
            },
            {
              id: 'hs-3',
              timestampOrRegion: 'Public Source Video',
              title: 'Old Campaign Video Was Online',
              finding:
                'Two days earlier, Arjun posted a bright indoor campaign video online. Anyone could download his face and voice from it.',
            },
          ],
        },
      },
      {
        id: 'cmp-ev-2',
        section: 'chat',
        cardLabel: 'Group Chat',
        title: 'Who Posted It & an Old Text',
        subtitle: 'Messages from the 400-student CampusBuzz chat',
        source: 'CampusBuzz Chat',
        timestamp: 'Oct 14 · 9:10 PM',
        summary:
          'An unknown account dropped the video right before election morning—along with a real angry text screenshot from Arjun.',
        keyTakeaway:
          'The poster created their account only 25 minutes earlier. The angry text was real, but it was cropped from an old chat about a broken 3D printer.',
        expectedClassifications: ['suspicious'],
        isMisleading: true,
        chatData: {
          platformName: 'CampusBuzz',
          channelTitle: '#Northbridge-General',
          participants: 'CampusWatch_99, Nikhil, Arjun',
          contextNote:
            'Look at who sent the video and why the extra screenshot made students jump to conclusions.',
          messages: [
            {
              id: 'm1',
              sender: 'CampusWatch_99',
              handle: 'New account · joined 25 mins ago',
              timestamp: '9:10 PM',
              text: 'Watch what Arjun really thinks about freshmen before you vote tomorrow! Filmed outside the library tonight.',
              isIncoming: true,
              flagNote: 'Brand-new anonymous account created just before posting.',
            },
            {
              id: 'm2',
              sender: 'CampusWatch_99',
              handle: 'New account · joined 25 mins ago',
              timestamp: '9:11 PM',
              text: 'Don’t believe me? Look at his real text: "I am done dealing with these clueless newcomers!"',
              isIncoming: true,
              flagNote:
                'Misleading clue: The full chat from 2 weeks ago shows Arjun was talking about a new 3D-printer repair company, not students.',
            },
            {
              id: 'm3',
              sender: 'Arjun Mehta',
              handle: 'Verified Student',
              timestamp: '9:24 PM',
              text: 'That video is fake! I grabbed coffee near the library at 6:30 PM, then I was inside the Robotics Lab from 7:05 PM to 8:10 PM.',
              isIncoming: false,
            },
          ],
        },
      },
      {
        id: 'cmp-ev-3',
        section: 'witness',
        cardLabel: 'Witnesses',
        title: 'Two People Saw Different Things',
        subtitle: 'Short notes from a classmate and a teacher',
        source: 'Student Office Notes',
        timestamp: 'Oct 15 · Morning',
        summary:
          'One classmate says she saw Arjun near the library. His lab teacher says he was across campus in the Robotics Lab.',
        keyTakeaway:
          'Riya likely saw Arjun earlier at 6:30 PM without checking her watch, while Prof. Lin confirms he was in the lab during the 7:20 PM video time.',
        expectedClassifications: ['reliable'],
        isKeyClue: true,
        witnessData: {
          statements: [
            {
              id: 'w1',
              witnessName: 'Riya Kapoor',
              role: 'Student · Rival Campaign Volunteer',
              recordedAt: 'Oct 15',
              quote:
                '"I walked past the library in the evening and saw Arjun outside in his dark hoodie. I think it was around 7:15 PM, though I didn’t check my phone clock."',
              credibilityContext:
                'She is not necessarily lying—Arjun really did walk past the library earlier at 6:30 PM in that hoodie.',
            },
            {
              id: 'w2',
              witnessName: 'Prof. Hannah Lin',
              role: 'Robotics Lab Teacher',
              recordedAt: 'Oct 15',
              quote:
                '"Arjun walked into my lab at 7:05 PM and worked right beside me until 8:10 PM. The library is a 12-minute walk away, so he could not have been there at 7:20 PM."',
              credibilityContext:
                'Independent teacher with no role in the student election.',
            },
          ],
        },
      },
      {
        id: 'cmp-ev-4',
        section: 'report',
        cardLabel: 'Door Log',
        title: 'Campus ID Card Scan Log',
        subtitle: 'Automatic electronic scans from Arjun’s student ID card',
        source: 'College Security Desk',
        timestamp: 'Oct 14 · Evening',
        summary:
          'Every time a student buys coffee or unlocks a lab door with their ID card, the college computer saves the exact time.',
        keyTakeaway:
          'Arjun’s ID card unlocked the Robotics Lab at 7:05 PM and stayed connected to Lab Wi-Fi until 8:12 PM—right when the video claims he was outside the library.',
        expectedClassifications: ['reliable'],
        isKeyClue: true,
        reportData: {
          documentNumber: 'ID-LOG-1014',
          issuingBody: 'College Security System',
          dateIssued: 'October 15',
          documentType: 'IT Access Log',
          headline: 'Automatic ID Scans for Arjun Mehta',
          introText: 'Students cannot edit these automatic door and Wi-Fi timestamps.',
          fields: [
            {
              label: '6:28 PM · Library Cafe',
              value: 'Bought one coffee (Matches Arjun’s story)',
              highlight: 'normal',
            },
            {
              label: '7:05 PM · Robotics Lab Door',
              value: 'Unlocked lab door with student ID card',
              highlight: 'verified',
            },
            {
              label: '7:20 PM · Video Claimed Time',
              value: 'Conflict: Arjun’s laptop was active inside Robotics Lab',
              highlight: 'alert',
            },
            {
              label: '8:12 PM · Robotics Lab Door',
              value: 'Swiped out of lab alongside Prof. Lin',
              highlight: 'verified',
            },
          ],
        },
      },
      {
        id: 'cmp-ev-5',
        section: 'report',
        cardLabel: 'Sound Check',
        title: 'Quick Audio & Face Check',
        subtitle: 'Visual scan of the video’s sound wave and face edges',
        source: 'Campus Media Lab',
        timestamp: 'Oct 15 · Noon',
        summary:
          'The college media lab checked the viral clip’s audio wave and lighting to see if anything was edited.',
        keyTakeaway:
          'The sound graph shows a sharp edit cut right at 0:15, and the face lighting matches Arjun’s indoor campaign video from two days earlier.',
        expectedClassifications: ['reliable'],
        isKeyClue: true,
        reportData: {
          documentNumber: 'MEDIA-CHECK-01',
          issuingBody: 'College Media Lab',
          dateIssued: 'October 15',
          documentType: 'Forensic Lab Report',
          imageUrl: '/src/assets/images/evidence_audio_forensics_1795245123024.jpg',
          imageAlt: 'Audio waveform screen showing a sharp vertical edit line at 0:15',
          headline: 'Simple Audio & Video Edit Check',
          introText: 'Here are the two clear signs of editing found in the viral clip:',
          fields: [
            {
              label: 'Sharp Audio Cut at 0:15',
              value: 'The sound wave shows an unnatural spike where AI-cloned speech was spliced in.',
              highlight: 'alert',
            },
            {
              label: 'Face Lighting Match',
              value: 'Warm indoor lighting on his face matches his public campaign video from Oct 12.',
              highlight: 'alert',
            },
          ],
        },
      },
    ],
    correctVerdict: 'Manipulated',
    alignedReasons: [
      'Clues show something was faked or changed.',
      'Some clues do not match up.',
      'The source cannot be trusted.',
    ],
    truthReveal: {
      outcomeHeadline: 'The Viral Video Was Faked (Deepfake)',
      explanation:
        'Someone filmed a lookalike wearing a dark hoodie outside the library at 7:20 PM, then swapped Arjun’s face and cloned his voice using his public indoor campaign video. They also added a real old text message cropped out of context to make students angry right before voting.',
      importantClues: [
        'Arjun’s ID card log and Prof. Lin both proved he was inside the Robotics Lab from 7:05 PM to 8:12 PM.',
        'His face had bright warm indoor light even though the library courtyard was dark blue dusk.',
        'The sound wave had a sharp splice cut at 0:15 where the wind went completely silent.',
      ],
      evidenceThatMatteredMost: [
        'Campus ID Card Scan Log (proved Arjun was in the Robotics Lab)',
        'Quick Audio & Face Check (showed the splice cut and mismatched face lighting)',
      ],
      misleadingEvidence: [
        'The cropped angry text was real, but it was from two weeks earlier about a broken 3D printer—and Riya saw Arjun in his hoodie earlier at 6:30 PM.',
      ],
      consequences:
        'Once the school shared the ID logs and media check, Arjun’s name was cleared and students learned to pause before forwarding shocking clips.',
    },
    learn: {
      whatHappened:
        'A fake video was mixed with one real out-of-context screenshot and dropped right before an election to spark fast outrage.',
      redFlags: [
        'Shocking videos posted by a brand-new anonymous account right before a big deadline.',
        'Face lighting that does not match the background.',
        'Cropped screenshots that hide dates or what the person was actually replying to.',
      ],
      whatShouldYouDo: [
        'Pause before sharing dramatic clips in group chats.',
        'Check simple facts like time, location, and who posted it first.',
        'Report fake harassment videos to school staff or moderators.',
      ],
      realLifeLesson:
        'Good hoaxes mix one real detail with a fake clip to make you react fast. Always check the time, source, and full context before sharing.',
    },
  },
  {
    id: 'financial-internship-trap',
    caseCode: 'CASE-02',
    categoryId: 'financial',
    levelNumber: 1,
    title: 'The Internship Trap',
    difficulty: 'Beginner',
    incidentDate: 'November 4',
    estimatedMinutes: 3,
    baseXp: 150,
    heroImage: '/src/assets/images/evidence_internship_office_1795245127532.jpg',
    shortHook:
      'Student Nadia gets a $4,200/month remote tech internship offer—with a sudden 5 PM fee deadline. Is this dream offer real or a scam?',
    summary:
      'Two days after posting her resume online, college junior Nadia Okafor receives a friendly remote internship offer from "Vanguard Crest Technologies" paying $4,200 a month. The website looks sleek and the recruiter even mentions Nadia’s campus career fair. Before shipping her work laptop, however, the recruiter asks Nadia to send a "refundable $285 deposit" before 5:00 PM today.',
    disputedClaim:
      'Is this $4,200/month remote internship offer from Vanguard Crest Technologies genuine?',
    objective:
      'Check the 5 short clues below to decide whether the internship offer is Authentic, Manipulated, or Not Enough Evidence.',
    characters: [
      {
        name: 'Nadia Okafor',
        role: 'College Student',
        note: 'Excited about the high pay, but paused when asked to pay $285 before 5:00 PM.',
      },
      {
        name: 'Elena Vance',
        role: 'Claimed Recruiter',
        note: 'Emailed from hiring@vanguardcrest-careers.co and did a 15-minute text-only interview.',
      },
      {
        name: 'Samir Patel',
        role: 'Campus Career Officer',
        note: 'Keeps the official contact list of companies that visit the college career fair.',
      },
    ],
    requiredEvidenceCount: 3,
    evidence: [
      {
        id: 'fin-ev-1',
        section: 'media',
        cardLabel: 'Website Photo',
        title: 'Company Website & Office Photo',
        subtitle: 'Banner photo from vanguardcrest-careers.co',
        source: 'Recruiter Website Link',
        timestamp: 'Nov 4 · 11:05 AM',
        summary:
          'The website shows a huge glass skyscraper and claims the company started in 2016 with 1,400 workers. A quick image and map search tells a different story.',
        keyTakeaway:
          'The big glass office photo is a stock image copied from a brochure, and the street address leads to a small mailbox shop.',
        expectedClassifications: ['suspicious'],
        isKeyClue: true,
        mediaData: {
          imageUrl: '/src/assets/images/evidence_internship_office_1795245127532.jpg',
          imageAlt: 'Modern glass office building lobby at twilight',
          mediaLabel: 'Website Banner · vanguardcrest-careers.co',
          caption: 'The website calls this their "Boston Global Headquarters."',
          hotspots: [
            {
              id: 'fin-hs-1',
              timestampOrRegion: 'Office Photo',
              title: 'Copied Stock Photo',
              finding:
                'A quick image search shows this exact building photo is a free stock picture used on website templates.',
            },
            {
              id: 'fin-hs-2',
              timestampOrRegion: 'Street Address',
              title: 'Mailbox Shop Address',
              finding:
                'Looking up the Boston street address on a map shows a tiny package-shipping store, not a 1,400-person headquarters.',
            },
          ],
        },
      },
      {
        id: 'fin-ev-2',
        section: 'chat',
        cardLabel: 'Recruiter Chat',
        title: 'Messages from "Elena Vance"',
        subtitle: 'Polite messages that rush Nadia toward a 5:00 PM deadline',
        source: 'Nadia’s Email & Chat',
        timestamp: 'Nov 4 · 10:02 AM – 12:15 PM',
        summary:
          'There are no spelling mistakes here, and Elena mentions Nadia’s real Spring Career Fair. Notice how she avoids a video call and rushes payment.',
        keyTakeaway:
          'Mentioning a real campus fair makes the email feel safe, but refusing a live call and demanding $285 before 5:00 PM are huge warning signs.',
        expectedClassifications: ['suspicious'],
        isMisleading: true,
        chatData: {
          platformName: 'Recruiter Messages',
          channelTitle: 'hiring@vanguardcrest-careers.co',
          participants: 'Elena Vance & Nadia',
          contextNote:
            'Modern scams often use polite, clean English and real school names.',
          messages: [
            {
              id: 'fm1',
              sender: 'Elena Vance',
              handle: 'hiring@vanguardcrest-careers.co',
              timestamp: '10:02 AM',
              text: 'Hi Nadia! We loved your resume and saw your school at our Spring Career Fair. Can we do a quick 15-minute text interview for our $4,200/month remote internship?',
              isIncoming: true,
              flagNote: 'Misleading detail: Mentioning the real career fair makes this feel genuine.',
            },
            {
              id: 'fm2',
              sender: 'Nadia Okafor',
              handle: 'Student',
              timestamp: '10:18 AM',
              text: 'Thank you! Could we do a quick video call with the team manager?',
              isIncoming: false,
            },
            {
              id: 'fm3',
              sender: 'Elena Vance',
              handle: 'hiring@vanguardcrest-careers.co',
              timestamp: '12:15 PM',
              text: 'Managers are busy today, so text is faster. Good news—you’re hired! Only 2 spots left before 5:00 PM. Please send the refundable $285 laptop deposit on QuickPay so we can ship your MacBook.',
              isIncoming: true,
              flagNote: 'No video call, instant job offer, and urgent 5:00 PM money request.',
            },
          ],
        },
      },
      {
        id: 'fin-ev-3',
        section: 'report',
        cardLabel: 'Offer Letter',
        title: 'The PDF Offer Letter',
        subtitle: 'Official-looking contract attached to Elena’s email',
        source: 'VC_Summer_Offer.pdf',
        timestamp: 'Nov 4 · 12:15 PM',
        summary:
          'The letter looks neat and corporate at the top, but the fine print asks Nadia to send money and private ID photos immediately.',
        keyTakeaway:
          'Real companies never ask interns to pay a "laptop deposit" to a personal QuickPay handle.',
        expectedClassifications: ['suspicious'],
        isKeyClue: true,
        reportData: {
          documentNumber: 'OFFER-889',
          issuingBody: 'Vanguard Crest Technologies',
          dateIssued: 'November 4',
          documentType: 'Offer Letter',
          headline: 'Remote Summer Internship Offer',
          introText: 'Key details from the PDF contract sent to Nadia:',
          fields: [
            {
              label: 'Pay & Hours',
              value: '$4,200/month for flexible part-time remote work',
              highlight: 'warning',
            },
            {
              label: 'Email vs. Footer Website',
              value: 'Sent from vanguardcrest-careers.co, but footer lists vanguardcresttech.com',
              highlight: 'alert',
            },
            {
              label: 'Laptop Security Deposit',
              value: 'Send $285 to QuickPay handle @VC-Onboarding-Desk before 5:00 PM',
              highlight: 'alert',
            },
            {
              label: 'Private Info Asked Now',
              value: 'Photo of driver’s license and bank account number on a plain web form',
              highlight: 'alert',
            },
          ],
        },
      },
      {
        id: 'fin-ev-4',
        section: 'witness',
        cardLabel: 'Campus Check',
        title: 'Career Office & Another Student',
        subtitle: 'What Nadia learned after asking two people on campus',
        source: 'Campus Career Office',
        timestamp: 'Nov 4 · 2:15 PM',
        summary:
          'A real company with a very similar name did visit the campus fair—which is why checking the exact email domain mattered.',
        keyTakeaway:
          'The real company uses @vanguardcrest.io and never charges fees, and another student got the exact same copy-pasted offer.',
        expectedClassifications: ['reliable'],
        isKeyClue: true,
        witnessData: {
          statements: [
            {
              id: 'fw1',
              witnessName: 'Samir Patel',
              role: 'University Career Officer',
              recordedAt: 'Nov 4',
              quote:
                '"A real firm named Vanguard Crest Systems came to our Spring Fair, but their official email is @vanguardcrest.io. I checked with them—nobody named Elena Vance works there, and they never charge laptop fees."',
              credibilityContext: 'Confirmed directly with the real company.',
            },
            {
              id: 'fw2',
              witnessName: 'Chloe Ramirez',
              role: 'Senior Student',
              recordedAt: 'Nov 4',
              quote:
                '"I got the exact same word-for-word offer ten days ago with the same $285 deposit and 5:00 PM deadline. When I asked for a video call, they vanished."',
              credibilityContext: 'Shows scammers sent the same fake offer to many students.',
            },
          ],
        },
      },
      {
        id: 'fin-ev-5',
        section: 'report',
        cardLabel: 'Website Age',
        title: 'Domain & Payment Check',
        subtitle: 'Simple lookup of when the recruiter’s website was created',
        source: 'Campus Cyber Club Check',
        timestamp: 'Nov 4 · 2:45 PM',
        summary:
          'Checking when a website address was created takes 10 seconds and reveals whether a company is really years old.',
        keyTakeaway:
          'Even though the site claims "Founded 2016", the domain vanguardcrest-careers.co was created just 11 days ago.',
        expectedClassifications: ['reliable'],
        isKeyClue: true,
        reportData: {
          documentNumber: 'WEB-CHECK-02',
          issuingBody: 'Public Domain Lookup',
          dateIssued: 'November 4',
          documentType: 'Registry Lookup',
          headline: 'Website Age & Payment Destination',
          introText: 'Comparing the recruiter’s link with the real company:',
          fields: [
            {
              label: 'Recruiter Domain Age',
              value: 'vanguardcrest-careers.co was created only 11 days ago',
              highlight: 'alert',
            },
            {
              label: 'Real Company Website',
              value: 'vanguardcrest.io has been active since 2016 (10 years old)',
              highlight: 'verified',
            },
            {
              label: 'QuickPay Handle',
              value: '@VC-Onboarding-Desk is a personal account, not a business account',
              highlight: 'alert',
            },
          ],
        },
      },
    ],
    correctVerdict: 'Manipulated',
    alignedReasons: [
      'The source cannot be trusted.',
      'Clues show something was faked or changed.',
      'Some clues do not match up.',
    ],
    truthReveal: {
      outcomeHeadline: 'The Offer Was a Fake Internship Scam',
      explanation:
        'Scammers looked up companies from Nadia’s real college career fair and copied the name of a real firm ("Vanguard Crest Systems"). They created a brand-new lookalike website 11 days ago using a stock office photo and sent copy-pasted offers to students hoping to steal $285 and personal ID details before 5:00 PM.',
      importantClues: [
        'Real employers never ask interns to pay a deposit for a work laptop.',
        'The email domain vanguardcrest-careers.co was only 11 days old, while the real company uses @vanguardcrest.io.',
        'They refused a live video call and sent the exact same letter to another student.',
      ],
      evidenceThatMatteredMost: [
        'Career Office Check (confirmed the real company never sent the offer)',
        'Domain & Payment Check (11-day-old lookalike site and personal QuickPay account)',
      ],
      misleadingEvidence: [
        'Clean, polite writing and mentioning the real Spring Career Fair made the email look trustworthy at first glance.',
      ],
      consequences:
        'Because Nadia paused and checked with the Career Office instead of rushing before 5:00 PM, she kept her $285 and protected her driver’s license and bank info.',
    },
    learn: {
      whatHappened:
        'Scammers imitated a real company from a college career fair and used a tight 5:00 PM deadline to pressure students into paying a fake laptop fee.',
      redFlags: [
        'Being asked to pay money upfront for a laptop, training, or deposit.',
        'Getting hired right away after a short text chat with no video call.',
        'Lookalike email addresses like "-careers.co" instead of the company’s official website.',
      ],
      whatShouldYouDo: [
        'Check the company’s official website yourself instead of trusting links in an email.',
        'Ask your school Career Office or request a live video call before sharing personal details.',
        'Never send money via instant payment apps to get a job or internship.',
      ],
      realLifeLesson:
        'Real companies pay you—you never pay to get hired. Polished writing is easy to fake, so always verify the email address and never rush a payment.',
    },
  },
];

export function getCaseById(caseId: string): CaseDefinition | undefined {
  return CASES.find((c) => c.id === caseId);
}

export function getPlayableCasesByCategory(categoryId: string): CaseDefinition[] {
  return CASES.filter((c) => c.categoryId === categoryId);
}
