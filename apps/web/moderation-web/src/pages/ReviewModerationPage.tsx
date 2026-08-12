import { useState } from "react";
import { useReviews, useSetLanguageVerified, useUndoReview } from "@/hooks";
import type { Review } from "@/types";

type Filter = "all" | "verified" | "unverified";

export function ReviewModerationPage() {
  const { data: reviews, isLoading } = useReviews();
  const setLanguageMutation = useSetLanguageVerified();
  const undoMutation = useUndoReview();
  const [filter, setFilter] = useState<Filter>("all");
  const [undoError, setUndoError] = useState<string | null>(null);

  const verified = reviews?.filter((r) => r.isLanguageVerified) ?? [];
  const unverified = reviews?.filter((r) => !r.isLanguageVerified) ?? [];

  const visible =
    filter === "verified"
      ? verified
      : filter === "unverified"
        ? unverified
        : (reviews ?? []);

  const handleUndo = (review: Review) => {
    setUndoError(null);
    undoMutation.mutate(review.id, {
      onError: (error: Error) => setUndoError(error.message),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500">Total Reviews</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            {reviews?.length ?? 0}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500">Language Verified</div>
          <div className="text-3xl font-bold text-tertiary-600 mt-1">
            {verified.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500">Pending Review</div>
          <div className="text-3xl font-bold text-secondary-600 mt-1">
            {unverified.length}
          </div>
        </div>
      </div>

      {undoError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {undoError}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(
          [
            { id: "all", label: `All (${reviews?.length ?? 0})` },
            { id: "verified", label: `Verified (${verified.length})` },
            {
              id: "unverified",
              label: `Unverified (${unverified.length})`,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === tab.id
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review list */}
      {visible.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          No reviews in this category
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onVerify={() =>
                setLanguageMutation.mutate({ id: review.id, verified: true })
              }
              onFlag={() =>
                setLanguageMutation.mutate({ id: review.id, verified: false })
              }
              onUndo={() => handleUndo(review)}
              isPending={
                setLanguageMutation.isPending || undoMutation.isPending
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  review,
  onVerify,
  onFlag,
  onUndo,
  isPending,
}: {
  review: Review;
  onVerify: () => void;
  onFlag: () => void;
  onUndo: () => void;
  isPending: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900">
              {review.restaurantName}
            </span>
            <span className="text-sm text-gray-500">·</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-xs font-medium">
              {review.language}
            </span>
            {review.isLanguageVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-tertiary-100 text-tertiary-700">
                Language Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                Pending Review
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            &ldquo;{review.content}&rdquo;
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold bg-secondary-100 text-secondary-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              clipRule="evenodd"
            />
          </svg>
          {review.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-4">
        {review.isLanguageVerified ? (
          <button
            onClick={onFlag}
            disabled={isPending}
            className="px-3 py-2 text-sm font-medium text-secondary-700 bg-secondary-50 border border-secondary-200 rounded-lg hover:bg-secondary-100 transition-colors disabled:opacity-50"
          >
            Flag Language
          </button>
        ) : (
          <button
            onClick={onVerify}
            disabled={isPending}
            className="px-3 py-2 text-sm font-medium text-tertiary-700 bg-tertiary-50 border border-tertiary-200 rounded-lg hover:bg-tertiary-100 transition-colors disabled:opacity-50"
          >
            Verify Language
          </button>
        )}
        <button
          onClick={onUndo}
          disabled={isPending}
          title="Undo last moderation action on this review"
          className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Undo
        </button>
      </div>
    </div>
  );
}
