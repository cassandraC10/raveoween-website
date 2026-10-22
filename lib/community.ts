/** Feature flag + shared types for the community phase. Applications stay closed until the flag is set. */
export const communityEnabled = process.env.NEXT_PUBLIC_COMMUNITY_ENABLED === 'true';

export type ApplicationStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'needs_more_info';
export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'expired' | 'manual_review';

/** Planned routes (see sitemap in the discovery pack). Not implemented in this release. */
export const plannedCommunityRoutes = ['/community/apply', '/community/application-status', '/login', '/dashboard'] as const;
