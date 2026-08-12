import { useState } from "react";
import { LoginPage } from "@/pages/LoginPage";
import { RestaurantVerificationPage } from "@/pages/RestaurantVerificationPage";
import { MediaModerationPage } from "@/pages/MediaModerationPage";
import { ReviewModerationPage } from "@/pages/ReviewModerationPage";
import { AdminLayout, type NavItem } from "@/layouts/AdminLayout";

type Page = "login" | "restaurants" | "media" | "reviews";

const NAV_ITEMS: NavItem[] = [
  {
    id: "restaurants",
    label: "Restaurant Verification",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
        />
      </svg>
    ),
  },
  {
    id: "media",
    label: "Media Moderation",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z"
        />
      </svg>
    ),
  },
  {
    id: "reviews",
    label: "Review Language",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
    ),
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("restaurants");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage("restaurants");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("restaurants");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pageContent =
    currentPage === "restaurants" ? (
      <RestaurantVerificationPage />
    ) : currentPage === "media" ? (
      <MediaModerationPage />
    ) : (
      <ReviewModerationPage />
    );

  const pageMeta =
    currentPage === "restaurants"
      ? {
          title: "Restaurant Verification",
          description: "Monitor verification status and review restaurant data",
        }
      : currentPage === "media"
        ? {
            title: "Media Moderation",
            description: "Approve or remove media uploaded to the platform",
          }
        : {
            title: "Review Language Moderation",
            description: "Verify the language of customer reviews",
          };

  return (
    <AdminLayout
      items={NAV_ITEMS}
      activeItem={currentPage}
      onNavigate={(id) => setCurrentPage(id as Page)}
      title={pageMeta.title}
      description={pageMeta.description}
      onLogout={handleLogout}
    >
      {pageContent}
    </AdminLayout>
  );
}

export default App;
