
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bookmark, Calendar, CheckCheck, Clock, Filter, Info, Search } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://your-project-url.supabase.co";
const supabaseKey = "your-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

// Define Inquiry type
type Inquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: "unread" | "read";
  bookmarked: boolean;
};

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
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

  // Handle authentication
  const handleLogin = () => {
    if (password === "1234") {
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "You have been logged in to the dashboard.",
      });
    } else {
      toast({
        title: "Error",
        description: "Incorrect password.",
        variant: "destructive",
      });
    }
  };

  // Mark inquiry as read
  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: 'read' })
        .eq('id', id);
        
      if (error) throw error;
      
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status: "read" } : inquiry
        )
      );
      
      toast({
        description: "Marked as read",
      });
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry",
        variant: "destructive",
      });
    }
  };

  // Toggle bookmark status
  const toggleBookmark = async (id: number) => {
    const inquiry = inquiries.find(i => i.id === id);
    if (!inquiry) return;
    
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ bookmarked: !inquiry.bookmarked })
        .eq('id', id);
        
      if (error) throw error;
      
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === id ? { ...inquiry, bookmarked: !inquiry.bookmarked } : inquiry
        )
      );
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-display text-estate-800">Dashboard Login</h2>
            <p className="mt-2 text-gray-600">Enter password to access owner dashboard</p>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="animate-fade-in"
                style={{ animationDelay: "100ms" }}
              />
            </div>
            <Button 
              className="w-full hover-scale animate-fade-in" 
              style={{ animationDelay: "200ms" }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-display text-estate-800 mb-4 md:mb-0 animate-fade-in">Contact Inquiries</h1>
          <div className="flex space-x-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inquiries..."
                className="pl-10 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="border rounded px-2 py-1.5 text-sm bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden animate-scale-in" style={{ animationDelay: "200ms" }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Message</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Loading inquiries...
                  </TableCell>
                </TableRow>
              ) : filteredInquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No inquiries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id} className={`${inquiry.status === "unread" ? "bg-blue-50" : ""} animate-fade-in`}>
                    <TableCell>
                      {inquiry.status === "unread" ? (
                        <div className="h-2 w-2 rounded-full bg-blue-500" aria-label="Unread" />
                      ) : (
                        <CheckCheck className="h-4 w-4 text-green-500" aria-label="Read" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {inquiry.message}
                    </TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        {formatDate(inquiry.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(inquiry.id)}
                          aria-label={inquiry.bookmarked ? "Remove bookmark" : "Bookmark"}
                          className="hover-scale"
                        >
                          <Bookmark
                            className={`h-4 w-4 ${inquiry.bookmarked ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                          />
                        </Button>
                        {inquiry.status === "unread" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(inquiry.id)}
                            aria-label="Mark as read"
                            className="hover-scale"
                          >
                            <CheckCheck className="h-4 w-4 text-gray-400" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="View details"
                          className="hover-scale"
                        >
                          <Info className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
