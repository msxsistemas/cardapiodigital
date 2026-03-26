import type { Category } from '../../types';

interface Props {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  primaryColor: string;
}

export function CategoryTabs({ categories, selectedCategory, onSelectCategory, primaryColor }: Props) {
  return (
    <div className="flex overflow-x-auto scrollbar-hide bg-white">
      {categories.map(cat => {
        const active = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="relative flex-shrink-0 px-4 py-3 text-[13px] font-semibold whitespace-nowrap transition-colors"
            style={{ color: active ? primaryColor : '#6b7280' }}
          >
            {cat.name}
            {active && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-sm"
                style={{ backgroundColor: primaryColor }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
