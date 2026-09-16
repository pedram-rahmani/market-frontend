"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@/store/hooks/storeHooks";
import { fetchReviews } from "@/store/slices/reviewsSlice";
import axiosInstance from "@/lib/axiosInstance";
import RatingStars from "@/components/ui/RatingStars/RatingStars";
import ReviewList from "./ReviewList";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";

interface IReviewForm {
  rating: number;
  comment: string;
  files?: FileList;
}

export default function ReviewSection({ productId }: { productId: number }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<
    { url: string; type: string }[]
  >([]);

  // pop up state
  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const { register, handleSubmit, reset, control } = useForm<IReviewForm>({
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const dispatch = useAppDispatch();
  const { items: reviews = [], loading } = useAppSelector(
    (state) => state.reviews,
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchReviews(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    return () => {
      previewFiles.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [previewFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    previewFiles.forEach((file) => URL.revokeObjectURL(file.url));

    const newPreviews = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
    }));

    setPreviewFiles(newPreviews);
  };

  const onSubmit: SubmitHandler<IReviewForm> = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("product_id", String(productId));
      formData.append("rating", String(data.rating));
      formData.append("comment", data.comment);

      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach((file) => {
          formData.append("files[]", file);
        });
      }

      await axiosInstance.post("/reviews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // success pop up
      setPopupState({
        isOpen: true,
        message: "نظر شما با موفقیت ثبت شد و پس از بررسی نمایش داده خواهد شد.",
        type: "success",
      });

      reset();
      previewFiles.forEach((file) => URL.revokeObjectURL(file.url));
      setPreviewFiles([]);
      dispatch(fetchReviews(productId));
    } catch (error: any) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        "خطایی در ثبت نظر رخ داد. لطفاً دوباره تلاش کنید.";

      // failed pop up
      setPopupState({
        isOpen: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-custom-gray-400/25 pt-10">
      <h2 className="text-xl font-bold text-text-on-light dark:text-text-on-dark/90 mb-6 flex gap-2">
        <svg viewBox="0 0 24 24" className="size-6 text-cyan-400 fill-current">
          <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
        </svg>
        دیدگاه‌ها و امتیاز کاربران
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 bg-white/80 dark:bg-dark-700/70 p-4 sm:p-6 rounded-3xl border border-custom-gray-100/70 dark:border-dark-600 mb-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <span className="text-sm text-text-on-light/70 dark:text-text-on-dark/60 font-medium">
            امتیاز شما به این محصول:
          </span>
          <Controller
            name="rating"
            control={control}
            render={({ field: { onChange, value } }) => (
              <RatingStars rating={value} onChange={onChange} size={20} />
            )}
          />
        </div>

        <textarea
          {...register("comment", { required: true })}
          placeholder="تجربه خرید یا نظرتان درباره کیفیت، طراحی و عملکرد این محصول را بنویسید..."
          className="w-full min-h-27.5 resize-y bg-dark-900/10 dark:bg-dark-900/50 border! border-custom-gray-200! dark:border-custom-gray-400/10! p-4 rounded-2xl text-sm text-text-on-light dark:text-text-on-dark focus:border-cyan-500! transition-all placeholder:text-text-on-light/50 dark:placeholder:text-text-on-dark/50"
        />

        <div className="space-y-3">
          {previewFiles.length > 0 && (
            <div className="flex gap-3 overflow-x-auto p-2 bg-black/20 rounded-xl">
              {previewFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-cyan-500/30 shrink-0"
                >
                  {file.type === "image" ? (
                    <img
                      src={file.url}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <label className="inline-flex items-center justify-center gap-2 text-xs text-text-on-light/70 dark:text-text-on-dark/60 hover:text-cyan-400 cursor-pointer transition-colors bg-dark-900/5 hover:bg-dark-900/10 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-custom-gray-300/60 dark:border-custom-gray-300/10 w-full sm:w-auto">
            <svg className="size-4!" viewBox="0 0 24 24">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <span>افزودن عکس یا ویدیو (اختیاری)</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              {...register("files", {
                onChange: handleFileChange,
              })}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-cyan-500 hover:bg-cyan-400 text-text-on-dark font-bold w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-2xl text-sx sm:text-sm transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/10 cursor-pointer"
          >
            {isSubmitting ? "در حال ثبت نظر..." : "ثبت دیدگاه"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-gray-400 text-center py-6">در حال دریافت نظرات...</p>
      ) : (
        <ReviewList productId={productId} initialReviews={reviews} />
      )}

      {/* pop up component */}
      <SimplePopup
        isOpen={popupState.isOpen}
        onClose={() => setPopupState((prev) => ({ ...prev, isOpen: false }))}
        message={popupState.message}
        type={popupState.type}
      />
    </div>
  );
}