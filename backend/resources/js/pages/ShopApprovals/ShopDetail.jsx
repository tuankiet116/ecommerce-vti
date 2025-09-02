import { SiteHeader } from "@/components/ultils/site-header";

export default function ShopDetail() {
    return (
        <>
            <SiteHeader title="Shop Approvals" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Shop Detail</h1>
                <p>This page will display detailed information about a specific shop.</p>
                {/* Additional content can be added here */}
            </div>
        </>
    );
}
