import React from 'react';
import { isPlaceholder, placeholderLabel } from '../assets/registry';

interface AssetImageProps {
  /** Asset path from registry — may be a placeholder or a real URL. */
  src: string;
  alt: string;
  className?: string;
  /** Tailwind classes for the placeholder box (size, aspect ratio, etc.). */
  placeholderClassName?: string;
}

/**
 * AssetImage
 *
 * Renders an <img> when the asset is final, or a labelled dev-only placeholder
 * box when the asset is still pending (PLACEHOLDER sentinel value).
 *
 * This lets layouts remain stable whether or not the final image is present,
 * which preserves sizing, aspect ratio, and positioning during development.
 *
 * To replace: update the path in registry.ts — no component changes needed.
 */
export const AssetImage: React.FC<AssetImageProps> = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
}) => {
  if (isPlaceholder(src)) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/20 rounded-xl text-center ${placeholderClassName || className}`}
        aria-label={`Placeholder: ${alt}`}
      >
        <span className="text-xs font-mono text-white/30 px-2 leading-relaxed break-all select-none">
          📷 {placeholderLabel(src)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      draggable={false}
    />
  );
};
