import { STATUS_ACTIVE, STATUS_INACTIVE, STATUS_REJECTED, STATUS_SUSPENDED } from "@/constants/common";
import { Badge } from "../ui/badge";

export default function StatusBadge({ status, ...props }) {
    return (
        <>
            {status === STATUS_ACTIVE && (
                <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600" {...props}>
                    Active
                </Badge>
            )}
            {status === STATUS_INACTIVE && (
                <Badge variant="secondary" className="bg-yellow-500 text-white dark:bg-yellow-600" {...props}>
                    Inactive
                </Badge>
            )}
            {status === STATUS_SUSPENDED && (
                <Badge variant="secondary" className="bg-red-500 text-white dark:bg-red-600" {...props}>
                    Suspended
                </Badge>
            )}
            {status === STATUS_REJECTED && (
                <Badge variant="secondary" className="bg-red-500 dark:bg-grey-600" {...props}>
                    Suspended
                </Badge>
            )}
        </>
    );
}
