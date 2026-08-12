import { useState } from "react";
import { useMedia, useSetMediaVerified, useUndoMedia } from "@/hooks";
import type { Media } from "@/types";

type Filter = "all" | "verified" | "unverified";

export function MediaModerationPage() {
  const { data: media, isLoading } = useMedia();
  const setVerifiedMutation = useSetMediaVerified();
  const undoMutation = useUndoMedia();
  const [filter, setFilter] = useState<Filter>("all");
  const [undoError, setUndoError] = useState<string | null>(null);

  const verified = media?.filter((m) => m.isVerified) ?? [];
  const unverified = media?.filter((m) => !m.isVerified) ?? [];

  const visible =
    filter === "verified"
      ? verified
      : filter === "unverified"
        ? unverified
        : (media ?? []);

  const handleUndo = (item: Media) => {
    setUndoError(null);
    undoMutation.mutate(item.id, {
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
          <div className="text-sm text-gray-500">Total Media</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            {media?.length ?? 0}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500">Verified</div>
          <div className="text-3xl font-bold text-tertiary-600 mt-1">
            {verified.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500">Unverified</div>
          <div className="text-3xl font-bold text-red-600 mt-1">
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
            { id: "all", label: `All (${media?.length ?? 0})` },
            { id: "verified", label: `Verified (${verified.length})` },
            { id: "unverified", label: `Unverified (${unverified.length})` },
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

      {/* Media grid */}
      {visible.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          No media in this category
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onVerify={() =>
                setVerifiedMutation.mutate({ id: item.id, isVerified: true })
              }
              onUnverify={() =>
                setVerifiedMutation.mutate({ id: item.id, isVerified: false })
              }
              onUndo={() => handleUndo(item)}
              isPending={
                setVerifiedMutation.isPending || undoMutation.isPending
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaCard({
  item,
  onVerify,
  onUnverify,
  onUndo,
  isPending,
}: {
  item: Media;
  onVerify: () => void;
  onUnverify: () => void;
  onUndo: () => void;
  isPending: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden ${
        item.isVerified ? "border-tertiary-200" : "border-red-200"
      }`}
    >
      <div className="relative">
        <img
          src={item.url}
          alt={item.title}
          className="w-full h-40 object-cover"
        />
        <span
          className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${
            item.isVerified
              ? "bg-tertiary-100 text-tertiary-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.isVerified ? "Verified" : "Unverified"}
        </span>
      </div>
      <div className="p-4">
        <div className="font-semibold text-gray-900">{item.title}</div>
        <div className="text-sm text-gray-500 mt-0.5">
          {item.restaurantName}
        </div>
        <div className="flex items-center gap-2 mt-4">
          {item.isVerified ? (
            <button
              onClick={onUnverify}
              disabled={isPending}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              Mark Unverified
            </button>
          ) : (
            <button
              onClick={onVerify}
              disabled={isPending}
              className="flex-1 px-3 py-2 text-sm font-medium text-tertiary-700 bg-tertiary-50 border border-tertiary-200 rounded-lg hover:bg-tertiary-100 transition-colors disabled:opacity-50"
            >
              Mark Verified
            </button>
          )}
          <button
            onClick={onUndo}
            disabled={isPending}
            title="Undo last moderation action on this media"
            className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Undo
          </button>
        </div>
      </div>
    </div>
  );
}
