import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockInvestmentRequests, mockCropListings, type InvestmentRequest } from "@/data/mockData";
import { Calendar, DollarSign, Package, TrendingUp, User, Wallet, Target, CheckCircle, Clock, XCircle, Loader2, AlertCircle } from "lucide-react";
import { useICPOffers, useICPStats, useICPHealth } from "@/hooks/useICP";
import { icpService } from "@/services/icpService";

const InvestorDashboard = () => {
  const { offers, loading: offersLoading, error: offersError } = useICPOffers();
  const { stats, loading: statsLoading } = useICPStats();
  const { isHealthy, loading: healthLoading } = useICPHealth();
  
  const [myRequests] = useState<InvestmentRequest[]>(mockInvestmentRequests);
  
  const featuredOpportunities = offers.filter(offer => 
    icpService.getOfferStatusString(offer.status) === "Active"
  ).slice(0, 3);

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "Accepted": return "bg-success text-success-foreground";
      case "Pending": return "bg-warning text-warning-foreground";
      case "Rejected": return "bg-destructive text-destructive-foreground";
      case "Cancelled": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getRequestIcon = (status: string) => {
    switch (status) {
      case "Accepted": return <CheckCircle className="h-4 w-4" />;
      case "Pending": return <Clock className="h-4 w-4" />;
      case "Rejected": return <XCircle className="h-4 w-4" />;
      case "Cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const totalInvested = myRequests
    .filter(req => req.status === "Accepted")
    .reduce((sum, req) => sum + req.totalOffered, 0);

  const pendingRequests = myRequests.filter(req => req.status === "Pending").length;
  const activeInvestments = myRequests.filter(req => req.status === "Accepted").length;

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Investor Dashboard</h1>
                <p className="text-muted-foreground">
                  Track your agricultural investments and discover new opportunities on ICP
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">ICP Backend:</span>
              {healthLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Badge variant={isHealthy ? "default" : "destructive"} className={isHealthy ? "bg-success text-success-foreground" : ""}>
                  {isHealthy ? "Connected" : "Disconnected"}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-primary">
                    {stats ? Number(stats.total_users).toLocaleString() : '0'}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Offers</CardTitle>
                  <Target className="h-4 w-4 text-success" />
                </div>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-success">
                    {stats ? Number(stats.active_offers) : '0'}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </div>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-warning">
                    {stats ? Number(stats.total_transactions) : '0'}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">ICP Wallet</CardTitle>
                  <Wallet className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">Not Connected</div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect ICP Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Featured Opportunities from ICP</h2>
              <Button variant="outline">
                View All Marketplace
              </Button>
            </div>

            {offersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading opportunities from ICP blockchain...</span>
              </div>
            ) : offersError ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Failed to load opportunities</h3>
                <p className="text-muted-foreground">{offersError}</p>
              </div>
            ) : featuredOpportunities.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredOpportunities.map((offer) => {
                  const productTypeString = icpService.getProductTypeString(offer.product_type);
                  const qualityGradeString = icpService.getQualityGradeString(offer.quality_grade);
                  const statusString = icpService.getOfferStatusString(offer.status);
                  
                  return (
                    <Card key={offer.id} className="shadow-medium hover:shadow-strong transition-all duration-300 bg-gradient-card border-0">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className="bg-success text-success-foreground">{statusString}</Badge>
                          <Badge className="bg-accent text-accent-foreground">{qualityGradeString}</Badge>
                        </div>
                        <CardTitle className="text-xl">{offer.product_name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {offer.farmer.toString().slice(0, 10)}...
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>{Number(offer.available_quantity)}kg</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-primary">${offer.price_per_kg.toFixed(2)}/kg</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span>Min: ${Number(offer.minimum_investment)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{offer.harvest_date}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border/50">
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {offer.description}
                          </p>
                          <Button className="w-full" variant="default">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Invest Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No opportunities available</h3>
                <p className="text-muted-foreground">Check back later for new investment opportunities from farmers.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <h2 className="text-2xl font-bold">My Investment Requests</h2>

            <div className="space-y-4">
              {myRequests.map((request) => {
                const listing = mockCropListings.find(l => l.id === request.offerId);
                
                return (
                  <Card key={request.id} className="shadow-soft">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {listing?.productName || 'Unknown Product'}
                            <Badge className={getRequestStatusColor(request.status)}>
                              {getRequestIcon(request.status)}
                              {request.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            Request to {listing?.farmerName || 'Unknown Farmer'}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            ${request.totalOffered.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {request.requestedQuantity}kg @ ${request.offeredPricePerKg}/kg
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Message:</p>
                          <p className="text-sm">{request.message}</p>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created:</span>
                            <span>{request.createdAt}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expires:</span>
                            <span>{request.expiresAt}</span>
                          </div>
                        </div>
                      </div>
                      
                      {request.status === 'Pending' && (
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            Edit Request
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancel Request
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {myRequests.length === 0 && (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No investment requests yet</h3>
                <p className="text-muted-foreground mb-4">Start investing in agricultural opportunities to build your portfolio.</p>
                <Button>
                  Explore Opportunities
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestorDashboard;