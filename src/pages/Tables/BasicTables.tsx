import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserComponentCard from "../../components/User/UserComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function BasicTables() {
    return (
        <>
            <PageMeta
                title="HF Wedding & Hire Cars"
                description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Admin" />
            <div className="space-y-6">
                <UserComponentCard />
            </div>
        </>
    );
}
