export type SubscriptionType = 'lunar';

export interface UserSubscription {
  type: SubscriptionType;
  valid_from: string;
  valid_until: string;
}
