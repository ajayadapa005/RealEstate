
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bookmark, Calendar, CheckCheck, Clock, Filter, Info, Search } from "lucide-react";

// Mock data for the dashboard
const mockInquiries = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "john@example.com", 
    message: "I'm interested in the property on 123 Main St.", 
    createdAt: "2023-05-15T10:30:00Z",
    status: "unread",
    bookmarked: true 
  },
  { 
    id: 2, 
    name: "Emily Johnson", 
    email: "emily@example.com", 
    message: "Please contact me about the downtown penthouse.", 
    createdAt: "2023-05-14T14:45:00Z",
    status: "read",
    bookmarked: false 
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    email: "michael@example.com", 
    message: "Looking for information on your luxury properties.", 
    createdAt: "2023-05-13T09:15:00Z",
    status: "read",
    bookmarked: true 
  },
  { 
    id: 4, 
    name: "Sarah Miller", 
    email: "sarah@example.com", 
    message: "Interested in scheduling a viewing this weekend.", 
    createdAt: "2023-05-12T16:20:00Z",
    status: "unread",
    bookmarked: false 
  },
  { 
    id: 5, 
    name: "David Wilson", 
    email: "david@example.com", 
    message: "Do you have any properties in the south district?", 
    createdAt: "2023-05-11T11:05:00Z",
    status: "read",
    bookmarked: false 
  },
];

type Inquiry = typeof mockInquiries[0];

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>(mockInquiries);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

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

  // Mark inquiry as read
  const markAsRead = (id: number) => {
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === id ? { ...inquiry, status: "read" } : inquiry
      )
    );
    toast({
      description: "Marked as read",
    });
  };

  // Toggle bookmark status
  const toggleBookmark = (id: number) => {
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === id ? { ...inquiry, bookmarked: !inquiry.bookmarked } : inquiry
      )
    );
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
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
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
              />
            </div>
            <Button className="w-full" onClick={handleLogin}>
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
          <h1 className="text-3xl font-display text-estate-800 mb-4 md:mb-0">Contact Inquiries</h1>
          <div className="flex space-x-4">
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

        <div className="bg-white rounded-lg shadow overflow-hidden">
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
              {filteredInquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No inquiries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id} className={inquiry.status === "unread" ? "bg-blue-50" : ""}>
                    <TableCell>
                      {inquiry.status === "unread" ? (
                        <div className="h-2 w-2 rounded-full bg-blue-500" title="Unread" />
                      ) : (
                        <CheckCheck className="h-4 w-4 text-green-500" title="Read" />
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
                          title={inquiry.bookmarked ? "Remove bookmark" : "Bookmark"}
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
                            title="Mark as read"
                          >
                            <CheckCheck className="h-4 w-4 text-gray-400" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View details"
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
