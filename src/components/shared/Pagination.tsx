'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    perPage: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (perPage: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    perPage,
    total,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) {
    if (total === 0) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-4 px-2 sm:flex-row sm:gap-0">
            <div className="hidden sm:flex items-center gap-2">
                <p className="text-sm text-slate-600">
                    {total} {total === 1 ? 'result' : 'results'}
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                    <p className="hidden text-sm text-slate-600 sm:block">Rows per page:</p>
                    <Select
                        value={perPage.toString()}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <p className="text-sm text-slate-600 min-w-[80px] text-center">
                        Page {currentPage} of {totalPages}
                    </p>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
