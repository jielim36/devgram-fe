import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

type PaginationProps = {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalData: number;
    limit: number;
}

export const PaginationComponent: React.FC<PaginationProps> = ({
    currentPage,
    setCurrentPage,
    totalData,
    limit
}) => {

    const totalPages = Math.ceil(totalData / limit);
    const lastPage = totalPages;

    const handleNext = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious = () => {
        const previousPage = currentPage - 1;
        if (previousPage <= 0) return;
        setCurrentPage(currentPage - 1);
    }

    const renderPaginationButtons = () => {
        let pages = [];

        if (totalPages <= 1) {
            pages = [1];
        } else if (currentPage === 1) {
            pages = [1, 2, 3].slice(0, totalPages);
        } else if (currentPage === 2) {
            pages = [1, 2, 3].slice(0, totalPages);
        } else if (currentPage >= lastPage - 1) {
            pages = [lastPage - 2, lastPage - 1, lastPage].filter(page => page > 0);
        } else {
            pages = [currentPage - 1, currentPage, currentPage + 1];
        }

        return pages.map(page => (
            <PaginationItem key={page}>
                <PaginationLink isActive={page === currentPage} onClick={() => setCurrentPage(page)}>
                    {page}
                </PaginationLink>
            </PaginationItem>
        ));
    };

    return (
        <Pagination>
            <PaginationContent>

                {/* Previous */}
                <PaginationItem onClick={handlePrevious}>
                    <PaginationPrevious />
                </PaginationItem>

                {/* Specific button */}
                {renderPaginationButtons()}

                {totalPages > 3 && currentPage < lastPage - 1 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* Next */}
                <PaginationItem onClick={handleNext}>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}