import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bookmark, Calendar, CheckCheck, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zmyyfacgqtidtawytwsa.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpteXlmYWNncXRpZHRhd3l0d3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MDU2MDMsImV4cCI6MjA1NzE4MTYwM30.vQO_FGu2_sBrImQ2J44xzAZCscW_3Fau8KQB29yaoYM";
const supabase = createClient(supabaseUrl, supabaseKey);

// Define Inquiry type
export type Inquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: "unread" | "read";
  bookmarked: boolean;
};

interface InquiriesListProps {
  inquiries: Inquiry[];
  isLoading: boolean;
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
}

const InquiriesList = ({ inquiries, isLoading, setInquiries }: InquiriesListProps) => {
  const { toast } = useToast();

  // Mark inquiry as read
  const markAsRead = async (id: number) => {
    try {
      // Update local state immediately for better UX
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status: "read" } : inquiry
        )
      );
      
      // Then attempt Supabase update
      try {
        const { error } = await supabase
          .from('inquiries')
          .update({ status: 'read' })
          .eq('id', id);
          
        if (error) {
          console.error('Error updating inquiry in Supabase:', error);
          throw error;
        }
        
        toast({
          description: "Marked as read",
        });
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Still keep the UI updated even if Supabase fails
        toast({
          description: "Marked as read (local only)",
        });
      }
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
      // Update local state immediately for better UX
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === id ? { ...inquiry, bookmarked: !inquiry.bookmarked } : inquiry
        )
      );
      
      // Then attempt Supabase update
      try {
        const { error } = await supabase
          .from('inquiries')
          .update({ bookmarked: !inquiry.bookmarked })
          .eq('id', id);
          
        if (error) {
          console.error('Error updating bookmark in Supabase:', error);
          throw error;
        }
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // The UI is already updated even if Supabase fails
      }
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

  return (
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
          ) : inquiries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No inquiries found
              </TableCell>
            </TableRow>
          ) : (
            inquiries.map((inquiry) => (
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
  );
};

export default InquiriesList;
