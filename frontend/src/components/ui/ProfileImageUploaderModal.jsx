import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  ZoomIn,
  RefreshCw,
} from "lucide-react";
import { uploadProfileImage } from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: { duration: 0.15 },
  },
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ProfileImageUploaderModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Clean up object URL when unmounting or changing preview
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetState = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setZoom(1);
    setIsDragging(false);
    setIsUploading(false);
    setErrorMessage("");
    setIsSuccess(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetState, 200);
  };

  const validateAndSetFile = (file) => {
    setErrorMessage("");
    if (!file) return;

    // Check type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage("Invalid file format. Please upload PNG, JPG, JPEG, or WEBP.");
      return;
    }

    // Check size
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage("Image size exceeds the 5 MB limit. Please select a smaller photo.");
      return;
    }

    // Generate preview
    const objectUrl = URL.createObjectURL(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setZoom(1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage("");

    try {
      const data = await uploadProfileImage(selectedFile);
      const newImageUrl = data.profile_image_url;

      // Update auth context state instantly
      if (setUser) {
        setUser((prev) => ({
          ...prev,
          profile_image_url: newImageUrl,
        }));
      }

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess(newImageUrl);
      }

      // Automatically close after success checkmark animation
      setTimeout(() => {
        handleClose();
      }, 1400);
    } catch (error) {
      const detail =
        error.response?.data?.detail ||
        "Failed to upload profile image. Please verify your connection and try again.";
      setErrorMessage(detail);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
            onClick={!isUploading ? handleClose : undefined}
          />

          {/* Modal Card */}
          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-slate-900 sm:p-7"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <Camera size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Update Profile Photo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG, or WEBP (Max 5MB)
                  </p>
                </div>
              </div>

              {!isUploading && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Error Message Alert */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, mt: 0 }}
                  animate={{ opacity: 1, height: "auto", mt: 16 }}
                  exit={{ opacity: 0, height: 0, mt: 0 }}
                  className="overflow-hidden rounded-xl border border-red-100 bg-red-50 p-3.5 text-xs font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400 flex items-start gap-2.5"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Body */}
            <div className="mt-5">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success-view"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="py-8 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Photo Uploaded!
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Your avatar has been updated across your active sessions.
                    </p>
                  </motion.div>
                ) : !previewUrl ? (
                  /* Drag and Drop Zone */
                  <motion.div
                    key="drop-zone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
                        isDragging
                          ? "border-blue-500 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20 scale-[1.01]"
                          : "border-slate-200 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-850/60"
                      )}
                    >
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/60 transition-transform duration-200 group-hover:scale-110 dark:bg-slate-800 dark:ring-slate-700">
                        <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Click to upload or drag & drop
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                        PNG, JPG, or WEBP up to 5MB
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ALLOWED_TYPES.join(",")}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </motion.div>
                ) : (
                  /* Image Preview & Optional Zoom Crop Inspector */
                  <motion.div
                    key="preview-zone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    {/* Circular Avatar Preview Container */}
                    <div className="relative mb-5 flex items-center justify-center">
                      <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                        <img
                          src={previewUrl}
                          alt="Avatar preview"
                          style={{ transform: `scale(${zoom})` }}
                          className="h-full w-full object-cover transition-transform duration-150 ease-out"
                        />
                      </div>
                      {/* Badge showing circular view */}
                      <span className="absolute -bottom-2.5 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                        Preview
                      </span>
                    </div>

                    {/* Zoom / Scale Controller */}
                    <div className="w-full max-w-xs space-y-2 rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 dark:bg-slate-850/60 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-350">
                        <span className="flex items-center gap-1.5">
                          <ZoomIn size={14} className="text-blue-500" />
                          Zoom / Fit
                        </span>
                        <span>{Math.round(zoom * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 dark:bg-slate-700"
                      />
                    </div>

                    {/* Change photo link */}
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => {
                        resetState();
                        fileInputRef.current?.click();
                      }}
                      className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <RefreshCw size={13} />
                      Choose a different photo
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer buttons */}
            {!isSuccess && (
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={handleClose}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                {previewUrl && (
                  <button
                    type="button"
                    disabled={isUploading || !selectedFile}
                    onClick={handleUpload}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        <span>Save & Upload Avatar</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileImageUploaderModal;
