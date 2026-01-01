import { Suspense } from "react";
import CreateBlogClient from "./CreateBlogClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
        </div>
      }
    >
      <CreateBlogClient />
    </Suspense>
  );
}
