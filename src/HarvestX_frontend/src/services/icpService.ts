import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Types matching your Candid interface
export type ProductType =
  | { Nuts: null }
  | { Grains: null }
  | { Legumes: null }
  | { Herbs: null }
  | { Vegetables: null }
  | { Other: string }
  | { Fruits: null };

export type QualityGrade =
  | { Premium: null }
  | { Grade1: null }
  | { Grade2: null }
  | { Certified: string }
  | { Standard: null }
  | { Organic: null };

export type OfferStatus =
  | { Active: null }
  | { Cancelled: null }
  | { Completed: null }
  | { Expired: null };

export type UserRole =
  | { Farmer: null }
  | { Guest: null }
  | { Admin: null }
  | { Investor: null };

export type RequestStatus =
  | { Rejected: null }
  | { Accepted: null }
  | { Cancelled: null }
  | { Expired: null }
  | { Pending: null };

export interface InvestmentOffer {
  id: string;
  status: OfferStatus;
  updated_at: bigint;
  total_quantity: bigint;
  minimum_investment: bigint;
  description: string;
  created_at: bigint;
  quality_grade: QualityGrade;
  product_name: string;
  product_type: ProductType;
  available_quantity: bigint;
  price_per_kg: number;
  location: string;
  farmer: Principal;
  harvest_date: string;
}

export interface UserProfile {
  updated_at: bigint;
  principal: Principal;
  role: UserRole;
  created_at: bigint;
  email: string;
  display_name: string;
}

export interface PlatformStats {
  total_requests: bigint;
  total_users: bigint;
  total_transactions: bigint;
  total_offers: bigint;
  active_offers: bigint;
}

export interface CreateOfferRequest {
  total_quantity: bigint;
  minimum_investment: bigint;
  description: string;
  quality_grade: QualityGrade;
  product_name: string;
  product_type: ProductType;
  price_per_kg: number;
  location: string;
  harvest_date: string;
}

export interface CreateInvestmentRequest {
  offer_id: string;
  message: string;
  offered_price_per_kg: number;
  requested_quantity: bigint;
}

export interface RegisterUserRequest {
  role: UserRole;
  email: string;
  display_name: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// IDL Factory for your canister
const idlFactory = ({ IDL }: any) => {
  const ProductType = IDL.Variant({
    'Nuts': IDL.Null,
    'Grains': IDL.Null,
    'Legumes': IDL.Null,
    'Herbs': IDL.Null,
    'Vegetables': IDL.Null,
    'Other': IDL.Text,
    'Fruits': IDL.Null,
  });
  const QualityGrade = IDL.Variant({
    'Premium': IDL.Null,
    'Grade1': IDL.Null,
    'Grade2': IDL.Null,
    'Certified': IDL.Text,
    'Standard': IDL.Null,
    'Organic': IDL.Null,
  });
  const UserRole = IDL.Variant({
    'Farmer': IDL.Null,
    'Guest': IDL.Null,
    'Admin': IDL.Null,
    'Investor': IDL.Null,
  });
  const UserProfile = IDL.Record({
    'updated_at': IDL.Nat64,
    'principal': IDL.Principal,
    'role': UserRole,
    'created_at': IDL.Nat64,
    'email': IDL.Text,
    'display_name': IDL.Text,
  });
  const RegisterUserRequest = IDL.Record({
    'role': UserRole,
    'email': IDL.Text,
    'display_name': IDL.Text,
  });
  const CreateOfferRequest = IDL.Record({
    'total_quantity': IDL.Nat64,
    'minimum_investment': IDL.Nat64,
    'description': IDL.Text,
    'quality_grade': QualityGrade,
    'product_name': IDL.Text,
    'product_type': ProductType,
    'price_per_kg': IDL.Float64,
    'location': IDL.Text,
    'harvest_date': IDL.Text,
  });
  const OfferStatus = IDL.Variant({
    'Active': IDL.Null,
    'Cancelled': IDL.Null,
    'Completed': IDL.Null,
    'Expired': IDL.Null,
  });
  const InvestmentOffer = IDL.Record({
    'id': IDL.Text,
    'status': OfferStatus,
    'updated_at': IDL.Nat64,
    'total_quantity': IDL.Nat64,
    'minimum_investment': IDL.Nat64,
    'description': IDL.Text,
    'created_at': IDL.Nat64,
    'quality_grade': QualityGrade,
    'product_name': IDL.Text,
    'product_type': ProductType,
    'available_quantity': IDL.Nat64,
    'price_per_kg': IDL.Float64,
    'location': IDL.Text,
    'farmer': IDL.Principal,
    'harvest_date': IDL.Text,
  });

  return IDL.Service({
    'create_agricultural_offer': IDL.Func([CreateOfferRequest], [IDL.Record({
      'data': IDL.Opt(InvestmentOffer),
      'error': IDL.Opt(IDL.Text),
      'success': IDL.Bool,
    })], []),
    'get_available_offers': IDL.Func([], [IDL.Record({
      'data': IDL.Opt(IDL.Vec(InvestmentOffer)),
      'error': IDL.Opt(IDL.Text),
      'success': IDL.Bool,
    })], ['query']),
    'get_platform_stats': IDL.Func([], [IDL.Record({
      'data': IDL.Opt(IDL.Record({
        'total_requests': IDL.Nat64,
        'total_users': IDL.Nat64,
        'total_transactions': IDL.Nat64,
        'total_offers': IDL.Nat64,
        'active_offers': IDL.Nat64,
      })),
      'error': IDL.Opt(IDL.Text),
      'success': IDL.Bool,
    })], ['query']),
    'get_current_user': IDL.Func([], [IDL.Record({
      'data': IDL.Opt(IDL.Opt(UserProfile)),
      'error': IDL.Opt(IDL.Text),
      'success': IDL.Bool,
    })], ['query']),
    'register_user': IDL.Func([RegisterUserRequest], [IDL.Record({
      'data': IDL.Opt(UserProfile),
      'error': IDL.Opt(IDL.Text),
      'success': IDL.Bool,
    })], []),
    'health_check': IDL.Func([], [IDL.Text], ['query']),
  });
};

class ICPService {
  private agent: HttpAgent;
  private actor: any;
  private canisterId = 'uxrrr-q7777-77774-qaaaq-cai';

  constructor() {
    // Always use localhost for local development
    const host = 'http://127.0.0.1:4943';

    this.agent = new HttpAgent({
      host,
    });

    // Always fetch root key for local development to avoid signature verification issues
    this.agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key. Check if local IC replica is running on port 4943.');
      console.error(err);
    });

    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId: this.canisterId,
    });
  }

  async healthCheck(): Promise<string> {
    try {
      return await this.actor.health_check();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  async getAvailableOffers(): Promise<InvestmentOffer[]> {
    try {
      const response = await this.actor.get_available_offers();
      if (response.success) {
        const data = this.unwrapOpt<InvestmentOffer[]>(response.data) ?? [];
        return data;
      }
      const err = this.unwrapText(response.error) || 'Failed to fetch offers';
      throw new Error(err);
    } catch (error) {
      console.error('Failed to get available offers:', error);
      throw error;
    }
  }

  async getPlatformStats(): Promise<PlatformStats> {
    try {
      const response = await this.actor.get_platform_stats();
      if (response.success) {
        const data = this.unwrapOpt<PlatformStats>(response.data);
        if (data) return data;
      }
      const err = this.unwrapText(response.error) || 'Failed to fetch platform stats';
      throw new Error(err);
    } catch (error) {
      console.error('Failed to get platform stats:', error);
      throw error;
    }
  }

  async createAgriculturalOffer(offerData: CreateOfferRequest): Promise<InvestmentOffer> {
    try {
      const response = await this.actor.create_agricultural_offer(offerData);
      if (response.success) {
        const data = this.unwrapOpt<InvestmentOffer>(response.data);
        if (data) return data;
      }
      const err = this.unwrapText(response.error) || 'Failed to create offer';
      throw new Error(err);
    } catch (error) {
      console.error('Failed to create agricultural offer:', error);
      throw error;
    }
  }

  // Helpers to unwrap candid Opt<>
  private unwrapOpt<T>(opt: any): T | null {
    if (opt === null || opt === undefined) return null;
    if (Array.isArray(opt)) return opt.length ? opt[0] : null;
    return opt as T;
  }

  private unwrapDoubleOpt<T>(optopt: any): T | null {
    const inner = this.unwrapOpt<any>(optopt);
    return this.unwrapOpt<T>(inner);
  }

  private unwrapText(opt: any): string | null {
    const v = this.unwrapOpt<string>(opt);
    return v ?? null;
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const response = await this.actor.get_current_user();
      if (response.success) {
        return this.unwrapDoubleOpt<UserProfile>(response.data);
      }
      const err = this.unwrapText(response.error) || 'Failed to fetch current user';
      throw new Error(err);
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }

  async registerUser(req: RegisterUserRequest): Promise<UserProfile> {
    try {
      const response = await this.actor.register_user(req);
      if (response.success) {
        const user = this.unwrapOpt<UserProfile>(response.data);
        if (user) return user;
      }
      const err = this.unwrapText(response.error) || 'Failed to register user';
      throw new Error(err);
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  }

  // Utility functions for type conversion
  convertProductType(type: string): ProductType {
    switch (type) {
      case 'Nuts': return { Nuts: null };
      case 'Grains': return { Grains: null };
      case 'Legumes': return { Legumes: null };
      case 'Herbs': return { Herbs: null };
      case 'Vegetables': return { Vegetables: null };
      case 'Fruits': return { Fruits: null };
      default: return { Other: type };
    }
  }

  convertQualityGrade(grade: string): QualityGrade {
    switch (grade) {
      case 'Premium': return { Premium: null };
      case 'Grade1': return { Grade1: null };
      case 'Grade2': return { Grade2: null };
      case 'Standard': return { Standard: null };
      case 'Organic': return { Organic: null };
      default: return { Certified: grade };
    }
  }

  convertUserRole(role: string): UserRole {
    switch (role) {
      case 'Farmer': return { Farmer: null };
      case 'Investor': return { Investor: null };
      case 'Admin': return { Admin: null };
      default: return { Guest: null };
    }
  }

  // Helper functions to extract values from variants
  getProductTypeString(productType: ProductType): string {
    if ('Nuts' in productType) return 'Nuts';
    if ('Grains' in productType) return 'Grains';
    if ('Legumes' in productType) return 'Legumes';
    if ('Herbs' in productType) return 'Herbs';
    if ('Vegetables' in productType) return 'Vegetables';
    if ('Fruits' in productType) return 'Fruits';
    if ('Other' in productType) return productType.Other;
    return 'Unknown';
  }

  getQualityGradeString(qualityGrade: QualityGrade): string {
    if ('Premium' in qualityGrade) return 'Premium';
    if ('Grade1' in qualityGrade) return 'Grade1';
    if ('Grade2' in qualityGrade) return 'Grade2';
    if ('Standard' in qualityGrade) return 'Standard';
    if ('Organic' in qualityGrade) return 'Organic';
    if ('Certified' in qualityGrade) return qualityGrade.Certified;
    return 'Unknown';
  }

  getOfferStatusString(status: OfferStatus): string {
    if ('Active' in status) return 'Active';
    if ('Cancelled' in status) return 'Cancelled';
    if ('Completed' in status) return 'Completed';
    if ('Expired' in status) return 'Expired';
    return 'Unknown';
  }
}

export const icpService = new ICPService();