import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "../ui/pagination";

export default function DefaultPagination({ selectedPage, totalPage, onPageChange }) {
    // Helper to render page button
    const renderPage = (page) => (
        <PaginationItem key={`page-${page}`}>
            <PaginationLink
                href="#"
                isActive={page === selectedPage}
                onClick={(e) => {
                    e.preventDefault();
                    if (onPageChange) onPageChange(page);
                }}
            >
                {page}
            </PaginationLink>
        </PaginationItem>
    );

    let pages = [];
    if (totalPage <= 5) {
        // Hiển thị tất cả các trang
        for (let i = 1; i <= totalPage; i++) {
            pages.push(renderPage(i));
        }
    } else {
        if (selectedPage <= 3) {
            // Đầu danh sách
            for (let i = 1; i <= 4; i++) {
                pages.push(renderPage(i));
            }
            pages.push(
                <PaginationItem key={`ellipsis-end-${selectedPage}`}>
                    <PaginationEllipsis />
                </PaginationItem>,
            );
            pages.push(renderPage(totalPage));
        } else if (selectedPage >= totalPage - 2) {
            // Cuối danh sách
            pages.push(renderPage(1));
            pages.push(
                <PaginationItem key={`ellipsis-start-${selectedPage}`}>
                    <PaginationEllipsis />
                </PaginationItem>,
            );
            for (let i = totalPage - 3; i <= totalPage; i++) {
                pages.push(renderPage(i));
            }
        } else {
            // Ở giữa
            pages.push(renderPage(1));
            pages.push(
                <PaginationItem key={`ellipsis-start-${selectedPage}`}>
                    <PaginationEllipsis />
                </PaginationItem>,
            );
            pages.push(renderPage(selectedPage - 1));
            pages.push(renderPage(selectedPage));
            pages.push(renderPage(selectedPage + 1));
            pages.push(
                <PaginationItem key={`ellipsis-end-${selectedPage}`}>
                    <PaginationEllipsis />
                </PaginationItem>,
            );
            pages.push(renderPage(totalPage));
        }
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (selectedPage > 1 && onPageChange) onPageChange(selectedPage - 1);
                        }}
                    />
                </PaginationItem>
                {pages}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (selectedPage < totalPage && onPageChange) onPageChange(selectedPage + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
