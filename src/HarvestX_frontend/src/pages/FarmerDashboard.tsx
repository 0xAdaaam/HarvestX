import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFarmerOffers, useRequestsForOffer, useRespondToRequest } from "@/hooks/useICP";
import { icpService } from "@/services/icpService";
import { CheckCircle, XCircle, Eye, Package, Users, Clock } from "lucide-react";
import { toast } from "sonner";

export default function FarmerDashboard() {
    const { offers, loading: offersLoading, error: offersError, refetch: refetchOffers } = useFarmerOffers();
    const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
    const { requests, loading: requestsLoading, refetch: refetchRequests } = useRequestsForOffer(selectedOffer || '');
    const { respond, loading: respondLoading } = useRespondToRequest();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'Expired':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getRequestStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Accepted':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'Cancelled':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            case 'Expired':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const handleResponse = async (requestId: string, accept: boolean) => {
        try {
            await respond({ request_id: requestId, accept });
            toast.success(`Request ${accept ? 'accepted' : 'rejected'} successfully`);
            refetchRequests();
            refetchOffers();
        } catch (error) {
            toast.error(`Failed to ${accept ? 'accept' : 'reject'} request`);
        }
    };

    const activeOffers = offers.filter(offer => icpService.getOfferStatusString(offer.status) === 'Active');
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(req => icpService.getRequestStatusString(req.status) === 'Pending').length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Farmer Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your crop listings and review investment requests from potential investors.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Package className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Offers</p>
                                <p className="text-2xl font-bold">{activeOffers.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                                <p className="text-2xl font-bold">{selectedOffer ? totalRequests : '0'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                                <p className="text-2xl font-bold">{selectedOffer ? pendingRequests : '0'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="offers" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="offers">My Offers</TabsTrigger>
                    <TabsTrigger value="requests">Investment Requests</TabsTrigger>
                </TabsList>

                <TabsContent value="offers" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Crop Listings</CardTitle>
                            <CardDescription>
                                View and manage your agricultural investment offerings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {offersLoading ? (
                                <div className="text-center py-8">Loading your offers...</div>
                            ) : offersError ? (
                                <div className="text-center py-8 text-red-500">
                                    Error loading offers: {offersError}
                                </div>
                            ) : offers.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No crop listings found.</p>
                                    <Button className="mt-4" onClick={() => window.location.href = '/create-listing'}>
                                        Create Your First Listing
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {offers.map((offer) => (
                                        <Card key={offer.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{offer.product_name}</h3>
                                                        <p className="text-muted-foreground">
                                                            {icpService.getProductTypeString(offer.product_type)} • {offer.location}
                                                        </p>
                                                    </div>
                                                    <Badge className={getStatusColor(icpService.getOfferStatusString(offer.status))}>
                                                        {icpService.getOfferStatusString(offer.status)}
                                                    </Badge>
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>

                                                <div className="grid md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="font-medium">Available Quantity</p>
                                                        <p>{Number(offer.available_quantity)} kg</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Price per kg</p>
                                                        <p>${offer.price_per_kg}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Quality Grade</p>
                                                        <p>{icpService.getQualityGradeString(offer.quality_grade)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Harvest Date</p>
                                                        <p>{offer.harvest_date}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex justify-end">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedOffer(offer.id)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Requests
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Investment Requests</CardTitle>
                            <CardDescription>
                                {selectedOffer
                                    ? "Review and respond to investment requests for your selected offer"
                                    : "Select an offer from the 'My Offers' tab to view its investment requests"
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!selectedOffer ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">
                                        Please select an offer to view its investment requests.
                                    </p>
                                </div>
                            ) : requestsLoading ? (
                                <div className="text-center py-8">Loading requests...</div>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">No investment requests found for this offer.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {requests.map((request) => (
                                        <Card key={request.id}>
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-semibold">Investment Request</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Submitted {new Date(Number(request.created_at) / 1000000).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge className={getRequestStatusColor(icpService.getRequestStatusString(request.status))}>
                                                        {icpService.getRequestStatusString(request.status)}
                                                    </Badge>
                                                </div>

                                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                                    <div>
                                                        <p className="font-medium text-sm">Requested Quantity</p>
                                                        <p>{Number(request.requested_quantity)} kg</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">Offered Price</p>
                                                        <p>${request.offered_price_per_kg}/kg</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">Total Value</p>
                                                        <p>${request.total_offered.toFixed(2)}</p>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="font-medium text-sm mb-2">Message from Investor:</p>
                                                    <p className="text-sm bg-muted p-3 rounded">{request.message}</p>
                                                </div>

                                                {icpService.getRequestStatusString(request.status) === 'Pending' && (
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleResponse(request.id, true)}
                                                            disabled={respondLoading}
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleResponse(request.id, false)}
                                                            disabled={respondLoading}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}