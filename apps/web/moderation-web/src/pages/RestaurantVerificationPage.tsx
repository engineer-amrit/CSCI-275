import { useState } from "react";
import {
  useRestaurants,
  useCheckRestaurantData,
  useSetRestaurantDataStatus,
} from "@/hooks";

export function RestaurantVerificationPage() {
  const { data: restaurants, isLoading } = useRestaurants();
  const checkDataMutation = useCheckRestaurantData();
  const setStatusMutation = useSetRestaurantDataStatus();
  const [dataCheckedId, setDataCheckedId] = useState<string | null>(null);

  const unverified = restaurants?.filter((r) => !r.isVerified) ?? [];
  const verified = restaurants?.filter((r) => r.isVerified) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status Overview */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-500">Total Restaurants</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">
              {restaurants?.length ?? 0}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-500">Verified</div>
            <div className="text-3xl font-bold text-tertiary-600 mt-1">
              {verified.length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-500">Pending Verification</div>
            <div className="text-3xl font-bold text-secondary-600 mt-1">
              {unverified.length}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-primary-600 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <div className="text-sm text-primary-700 leading-relaxed">
            Restaurant verification is performed{" "}
            <span className="font-semibold">automatically</span> based on
            customer reviews. A restaurant is verified once it has at least 5
            valid reviews from 5 different users with an average rating of 2.5
            or higher. Moderators cannot manually change this status.
          </div>
        </div>
      </div>

      {/* Verified / Pending lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
            Verified ({verified.length})
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-tertiary-100 text-tertiary-700">
              Auto
            </span>
          </h2>
          <div className="space-y-3">
            {verified.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                No verified restaurants yet
              </div>
            ) : (
              verified.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {restaurant.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {restaurant.cuisine} · {restaurant.location}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-tertiary-100 text-tertiary-700">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Verification ({unverified.length})
          </h2>
          <div className="space-y-3">
            {unverified.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                All restaurants are verified
              </div>
            ) : (
              unverified.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {restaurant.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {restaurant.cuisine} · {restaurant.location}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.401 12.528a1.5 1.5 0 000-3.056.75.75 0 000-.196 3 3 0 011.5-1.851l.173.5a.75.75 0 001.42-.494L7.32 7.534a3 3 0 01.764-1.622 3 3 0 012.604-.61c.55.127 1.023.435 1.34.86a.75.75 0 101.188-.916A4.5 4.5 0 0012.435 4.5H12a.75.75 0 000 1.5h.566c.221 0 .438.042.634.122a3 3 0 01-.274 5.484.75.75 0 10.348 1.46 4.5 4.5 0 10-7.9-4.475l.17-.49a.75.75 0 00-1.42-.494l-.183.527a3 3 0 01-1.5 1.85.75.75 0 00-.226.098zM13.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-9 5.25v-.75a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pending
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Data Verification */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Restaurant Data Verification
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Manually review each restaurant&apos;s title and description for any
          verbal (offensive) language. Flag any content that violates platform
          policies.
        </p>
        <div className="space-y-3">
          {restaurants?.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary-600"
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
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {restaurant.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {restaurant.cuisine} · {restaurant.location}
                    </div>
                  </div>
                </div>
                <DataStatusBadge status={restaurant.dataStatus} />
              </div>

              <div className="border-t border-gray-100 p-5 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Title
                    </div>
                    <div
                      className={`text-sm text-gray-800 p-3 rounded-lg bg-white border ${
                        restaurant.flaggedWords.some((w) =>
                          restaurant.name.toLowerCase().includes(w),
                        )
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    >
                      {restaurant.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Description
                    </div>
                    <div
                      className={`text-sm text-gray-800 p-3 rounded-lg bg-white border ${
                        restaurant.flaggedWords.some((w) =>
                          restaurant.description.toLowerCase().includes(w),
                        )
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    >
                      {restaurant.description}
                    </div>
                  </div>
                </div>

                {restaurant.dataStatus === "flagged" &&
                  restaurant.flaggedWords.length > 0 && (
                    <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                      <svg
                        className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                      <div className="text-sm text-red-700">
                        Flagged verbal language found:{" "}
                        <span className="font-mono font-semibold">
                          {restaurant.flaggedWords.join(", ")}
                        </span>
                      </div>
                    </div>
                  )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setDataCheckedId(restaurant.id);
                      checkDataMutation.mutate(restaurant.id);
                    }}
                    disabled={checkDataMutation.isPending}
                    className="px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50"
                  >
                    Run Language Check
                  </button>
                  <button
                    onClick={() =>
                      setStatusMutation.mutate({
                        restaurantId: restaurant.id,
                        status: "verified",
                      })
                    }
                    disabled={setStatusMutation.isPending}
                    className="px-3 py-2 text-sm font-medium text-tertiary-700 bg-tertiary-50 border border-tertiary-200 rounded-lg hover:bg-tertiary-100 transition-colors disabled:opacity-50"
                  >
                    Mark Clean
                  </button>
                  <button
                    onClick={() =>
                      setStatusMutation.mutate({
                        restaurantId: restaurant.id,
                        status: "flagged",
                      })
                    }
                    disabled={setStatusMutation.isPending}
                    className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Flag Data
                  </button>
                  {dataCheckedId === restaurant.id &&
                    checkDataMutation.isPending && (
                      <span className="text-sm text-gray-500">Checking...</span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataStatusBadge({
  status,
}: {
  status: "pending" | "verified" | "flagged";
}) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-tertiary-100 text-tertiary-700">
        Data Verified
      </span>
    );
  }
  if (status === "flagged") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Flagged
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
      Not Reviewed
    </span>
  );
}
