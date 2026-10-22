export type HouseRule = { id: string; image: string; title: string; body: string[] };

/** Verbatim from the supplied house-rules cards and the production site. */
export const noPhotoPolicy = {
  headline: 'No Photos/Videos',
  short: 'No photography, no video, no live-streaming, no recording.',
  detail: 'Cameras will be stickered upon entry, and anyone caught recording will be removed immediately.',
};

export const houseRules: HouseRule[] = [
  { id: 'respect-the-space', image: '1', title: 'Respect The Space', body: [
    'Raveoween is a celebration of freedom and expression for the ALTER EGO, not just a night out. Protect the culture, embrace the energy, and move with intention.',
    'Immerse yourself in the moment, and truly live the experience. If your purpose is to seek attention, chase clout, or curate social media moments, this isn\u2019t the place for you.'] },
  { id: 'no-photos-videos', image: '2', title: 'No Photos/Videos Allowed', body: [
    'This space is meant to be felt, not filmed. Experience the music, the energy, and the raw connection without the distraction of a screen. No photos and videos once you enter the venue.',
    'Cameras will be stickered upon entry, and anyone caught recording will be removed immediately.'] },
  { id: 'no-harassment-or-hate', image: '3', title: 'No harassment or hate will be tolerated', body: [
    'This space was built on unity, freedom, and expression. House music was born from marginalized communities who created these movements as sanctuaries of acceptance.',
    'There is zero tolerance for discrimination, hate, or violence of any kind. Sexism, racism, homophobia, transphobia, or any form of exclusion will not be tolerated.'] },
  { id: 'consent', image: '4', title: 'Consent is Non-Negotiable', body: [
    'The absence of a clear, enthusiastic \u201CYES\u201D is always a \u201CNO\u201D. Boundaries must be honored, and any form of unwanted contact is unacceptable. Intoxication is never an excuse. Everyone deserves to feel safe, comfortable, and in control of their own experience.'] },
  { id: 'be-conscious', image: '5', title: 'Be Conscious', body: [
    'We are all responsible for maintaining a safe and inclusive space. If you see something that feels wrong \u2014 SPEAK UP. Whether it\u2019s someone in distress, inappropriate behavior, or a situation that doesn\u2019t sit right, don\u2019t stay silent. Safety is collective.',
    'Watch out for your friends, check in on those around you, and don\u2019t hesitate to reach out to staff or security if needed. Let\u2019s protect each other.'] },
  { id: 'let-the-people-dance', image: '6', title: 'Let The People Dance', body: [
    'The dancefloor is a space for pure connection between music, movement, and energy. When someone is lost in the rhythm, let them stay there. Not every moment needs words, a tap on the shoulder, or a distraction.',
    'Let the music speak, and allow everyone to experience their journey uninterrupted.'] },
];
