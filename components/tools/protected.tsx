import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { Loader2, Wallet } from "lucide-react";

// --- Helper Component for Protected Images ---
const ProtectedImage = ({
  filename,
  alt,
  className,
}: {
  filename: string;
  alt: string;
  className?: string;
}) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        // If no user, we can't fetch protected images
        if (!user) {
          throw new Error("User not authenticated");
        }

        const token = await user.getIdToken();

        const res = await fetch(`/api/what/${filename}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch image");

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setSrc(objectUrl);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error loading image ${filename}:`, err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchImage();

    // Cleanup object URL to avoid memory leaks
    return () => {
      isMounted = false;
      if (src) URL.revokeObjectURL(src);
    };
  }, [filename]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-muted/50 rounded-full ${className}`}
      >
        <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !src) {
    // Fallback if image fails
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-full ${className}`}
      >
        <Wallet className="w-1/2 h-1/2 text-muted-foreground" />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} />;
};

export default ProtectedImage;
