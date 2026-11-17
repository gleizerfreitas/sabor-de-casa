export type Category = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Dish = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  photo_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CatalogData = { categories: Category[]; dishes: Dish[] };
