
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

interface InquiryFiltersProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
}

const InquiryFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter 
}: InquiryFiltersProps) => {
  return (
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
  );
};

export default InquiryFilters;
