export type ListingCondition = "nuevo" | "como_nuevo" | "bueno" | "aceptable";
export type ListingStatus = "active" | "sold" | "paused";

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  whatsapp: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Listing {
  id: string;
  user_id: string;
  category_id: number | null;
  title: string;
  description: string;
  price: number;
  condition: ListingCondition;
  location: string;
  municipio?: string;
  featured?: boolean;
  featured_until?: string;
  images: string[];
  whatsapp: string;
  status: ListingStatus;
  views: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  categories?: Category;
}

export const CONDITION_LABELS: Record<ListingCondition, string> = {
  nuevo: "Nuevo",
  como_nuevo: "Como Nuevo",
  bueno: "Bueno",
  aceptable: "Aceptable",
};

export const CONDITION_COLORS: Record<ListingCondition, string> = {
  nuevo: "bg-green-100 text-green-800",
  como_nuevo: "bg-blue-100 text-blue-800",
  bueno: "bg-yellow-100 text-yellow-800",
  aceptable: "bg-orange-100 text-orange-800",
};
