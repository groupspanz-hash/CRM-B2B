import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'sales';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export type RelationshipLevel = 'Cold' | 'Warm' | 'Engaged' | 'Trusted' | 'Loyal';
export type CustomerStatus = 'Deal' | 'Negosiasi' | 'Menolak';

export interface PIC {
  name: string;
  position: string;
  phone: string;
  email: string;
  birthday?: string;
}

export interface Customer {
  id: string;
  companyName: string;
  phone: string;
  address: string;
  revenue: number;
  industry: string;
  relationshipScore: number;
  rsLevel: RelationshipLevel;
  lastActivityDate?: Timestamp;
  status: CustomerStatus;
  probability: number;
  pic1: PIC;
  pic2: PIC;
  ownerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  birthdayTemplate?: string;
  relationshipCategory?: string;
  relationshipTrustLevel?: string;
  relationshipApproach?: string;
  relationshipNotes?: string;
}

export type ActivityType = 
  | 'chat_telpon' | 'meeting'
  | 'joy_wish' | 'non_sales_fu'
  | 'consultation_solusi' | 'gift'
  | 'deal_first' | 'repeat_order' | 'long_term' | 'referral'
  | 'no_response_14' | 'no_response_30' | 'failed_deal' | 'complaint';

export interface Activity {
  id: string;
  customerId: string;
  type: ActivityType;
  date: Timestamp;
  actorName: string;
  notes: string;
  points: number;
  ownerId: string;
}

export interface Schedule {
  id: string;
  customerId: string;
  type: ActivityType;
  date: Timestamp;
  notes: string;
  status: 'pending' | 'completed';
  ownerId: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
