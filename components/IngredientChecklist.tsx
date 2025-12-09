import { CheckCircle2, Circle, Play } from 'lucide-react';
import { Ingredient } from '../App';

interface IngredientChecklistProps {
  ingredients: Ingredient[];
  onToggle: (id: string) => void;
  onStartCooking: () => void;
  allChecked: boolean;
}

export function IngredientChecklist({
  ingredients,
  onToggle,
  onStartCooking,
  allChecked,
}: IngredientChecklistProps) {
  const checkedCount = ingredients.filter(i => i.checked).length;
  const progress = (checkedCount / ingredients.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-gray-700">Gather Your Ingredients</h2>
          <span className="text-gray-500">
            {checkedCount} of {ingredients.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {ingredients.map(ingredient => (
          <button
            key={ingredient.id}
            onClick={() => onToggle(ingredient.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
              ingredient.checked
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {ingredient.checked ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
            )}
            <div className="flex-1 text-left">
              <div
                className={`${
                  ingredient.checked ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {ingredient.name}
              </div>
              <div className="text-gray-500">{ingredient.amount}</div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onStartCooking}
        disabled={!allChecked}
        className={`w-full py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all ${
          allChecked
            ? 'bg-orange-500 hover:bg-orange-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Play className="w-5 h-5" />
        {allChecked ? "Let's Start Cooking!" : 'Check off all ingredients to start'}
      </button>
    </div>
  );
}
