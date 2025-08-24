import { useState, useEffect } from 'react';
import { icpService, InvestmentOffer, PlatformStats, CreateOfferRequest, UserProfile, RegisterUserRequest } from '@/services/icpService';

export const useICPOffers = () => {
  const [offers, setOffers] = useState<InvestmentOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await icpService.getAvailableOffers();
      setOffers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return { offers, loading, error, refetch: fetchOffers };
};

export const useICPStats = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await icpService.getPlatformStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

export const useCreateOffer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOffer = async (offerData: CreateOfferRequest): Promise<InvestmentOffer | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await icpService.createAgriculturalOffer(offerData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create offer');
      console.error('Error creating offer:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOffer, loading, error };
};

export const useICPHealth = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const response = await icpService.healthCheck();
      setIsHealthy(response === 'OK' || response.includes('healthy'));
    } catch (err) {
      setIsHealthy(false);
      console.error('Health check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return { isHealthy, loading, refetch: checkHealth };
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await icpService.getCurrentUser();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      console.error('Error fetching current user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, refetch: fetchUser };
};

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (req: RegisterUserRequest): Promise<UserProfile | null> => {
    try {
      setLoading(true);
      setError(null);
      const user = await icpService.registerUser(req);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register user');
      console.error('Error registering user:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};