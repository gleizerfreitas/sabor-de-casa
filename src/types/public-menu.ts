export type PublicDish = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  photoUrl: string;
  available: boolean;
};

export type PublicMenu = {
  date: string;
  dateLabel: string;
  timezone: string;
  whatsapp: string;
  isOpen: boolean;
  statusMessage: string;
  categories: Array<{
    id: string;
    name: string;
    dishes: PublicDish[];
  }>;
};
