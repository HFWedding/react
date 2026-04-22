import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "./SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="HF Wedding & Hire Cars"
              description="HF Wedding & Hire Cars - Admin Portal"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
