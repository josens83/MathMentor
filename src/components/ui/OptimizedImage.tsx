import Image from "next/image";
import { cn } from "@/lib/utils";

type AspectRatio = "16/9" | "4/3" | "1/1" | "3/4" | "21/9";

interface OptimizedImageProps {
  /**
   * Image source URL
   */
  src: string;
  /**
   * Alt text for accessibility
   */
  alt: string;
  /**
   * Aspect ratio for CLS prevention
   * @default "16/9"
   */
  aspectRatio?: AspectRatio;
  /**
   * Mark as LCP element (adds priority loading)
   * @default false
   */
  priority?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Container CSS classes
   */
  containerClassName?: string;
  /**
   * Responsive sizes attribute
   * @default "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
   */
  sizes?: string;
  /**
   * Image quality (1-100)
   * @default 85
   */
  quality?: number;
  /**
   * Object fit style
   * @default "cover"
   */
  objectFit?: "cover" | "contain" | "fill" | "none";
  /**
   * Enable blur placeholder
   * @default true
   */
  blur?: boolean;
  /**
   * Custom blur data URL (base64)
   */
  blurDataURL?: string;
}

/**
 * Optimized Image Component
 *
 * Prevents CLS by reserving space with aspect-ratio.
 * Automatically applies best practices for Core Web Vitals.
 *
 * @example
 * ```tsx
 * // Hero image (LCP candidate)
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero banner"
 *   priority
 *   aspectRatio="21/9"
 * />
 *
 * // Product image
 * <OptimizedImage
 *   src={product.image}
 *   alt={product.name}
 *   aspectRatio="1/1"
 *   sizes="(max-width: 768px) 50vw, 25vw"
 * />
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  aspectRatio = "16/9",
  priority = false,
  className,
  containerClassName,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
  objectFit = "cover",
  blur = true,
  blurDataURL,
}: OptimizedImageProps): React.ReactElement {
  // Default blur placeholder (tiny gray image)
  const defaultBlurDataURL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-gray-100 rounded-lg",
        containerClassName
      )}
      style={{ aspectRatio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur ? (blurDataURL ?? defaultBlurDataURL) : undefined}
        className={cn(
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          className
        )}
      />
    </div>
  );
}

/**
 * Responsive Image with explicit dimensions
 *
 * Use when you know the exact dimensions of the image.
 */
interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes = "100vw",
  quality = 85,
}: ResponsiveImageProps): React.ReactElement {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      quality={quality}
      priority={priority}
      className={cn("max-w-full h-auto", className)}
      style={{
        // Prevent CLS by maintaining aspect ratio
        aspectRatio: `${width}/${height}`,
      }}
    />
  );
}
