import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  setPage: (page: number) => void;
  setItemsPerPage?: (perPage: number) => void;
}

export default function Pagination({ currentPage, totalItems, setPage, itemsPerPage = 10, setItemsPerPage }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;
  
  const makePageArray = () => {
    // Show up to 5 numbered pages: ... 2 3 4 ...
    let pages = [];
    if (totalPages <= 5) {
      for(let i=1; i<=totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages = [1,2,3,4,'...',totalPages];
      else if (currentPage >= totalPages-2) pages = [1,'...',totalPages-3,totalPages-2,totalPages-1,totalPages];
      else pages = [1,'...',currentPage-1,currentPage,currentPage+1,'...',totalPages];
    }
    return pages;
  };

  const handlePerPageChange = (newPerPage: number) => {
    if (setItemsPerPage) {
      setItemsPerPage(newPerPage);
      setPage(1); // Reset to first page when changing items per page
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center mt-4 mb-10">
      {/* Items per page dropdown */}
      {setItemsPerPage && (
        <div className="flex items-center gap-2 mr-4">
          <span className="text-sm text-muted-foreground">Show:</span>
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="appearance-none bg-card border border-border rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      )}
      
      <button
        onClick={() => setPage(currentPage-1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded hover:bg-muted disabled:opacity-50"
      >
        Prev
      </button>
      {makePageArray().map((p,i) =>
        typeof p === 'number' ? (
          <button
            key={i}
            onClick={() => setPage(p)}
            className={`px-2 py-1 rounded ${p === currentPage ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            {p}
          </button>
        ) : (
          <span key={i} className="px-2 text-muted-foreground">…</span>
        )
      )}
      <button
        onClick={() => setPage(currentPage+1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded hover:bg-muted disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}

