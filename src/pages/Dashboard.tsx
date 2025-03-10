
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@supabase/supabase-js";
import DashboardAuth from "@/components/dashboard/DashboardAuth";
import InquiryFilters from "@/components/dashboard/InquiryFilters";
import InquiriesList, { Inquiry } from "@/components/dashboard/InquiriesList";

// Initialize Supabase client
const supabaseUrl = "https://your-project-url.supabase.co";
const supabaseKey = "your-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Set up real-time subscription once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
      
      // Subscribe to changes
      const subscription = supabase
        .channel('inquiries-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'inquiries' }, 
          payload => {
            console.log('Change received!', payload);
            fetchInquiries();
            
            if (payload.eventType === 'INSERT') {
              toast({
                title: "New Inquiry!",
                description: `From: ${payload.new.name}`,
              });
            }
          }
        )
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isAuthenticated]);

  // Fetch inquiries from Supabase
  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setInquiries(data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter inquiries based on status and search query
  useEffect(() => {
    let filtered = inquiries;
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        inquiry => 
          inquiry.name.toLowerCase().includes(query) ||
          inquiry.email.toLowerCase().includes(query) ||
          inquiry.message.toLowerCase().includes(query)
      );
    }
    
    setFilteredInquiries(filtered);
  }, [inquiries, statusFilter, searchQuery]);

  if (!isAuthenticated) {
    return <DashboardAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <InquiryFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <InquiriesList 
          inquiries={filteredInquiries}
          isLoading={isLoading}
          setInquiries={setInquiries}
        />
      </div>
    </div>
  );
};

export default Dashboard;
