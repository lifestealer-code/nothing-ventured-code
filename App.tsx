import { useState } from 'react';
import { IngredientChecklist } from './components/IngredientChecklist';
import { CookingSteps } from './components/CookingSteps';
import { ChefHat } from 'lucide-react';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  duration?: number; // in seconds
  tip?: string;
}

const RECIPE = {
  name: 'Classic Margherita Pizza',
  prepTime: '20 min',
  cookTime: '15 min',
  servings: 4,
  ingredients: [
    { id: '1', name: 'Pizza dough', amount: '1 ball (400g)', checked: false },
    { id: '2', name: 'San Marzano tomatoes', amount: '1 can (400g)', checked: false },
    { id: '3', name: 'Fresh mozzarella', amount: '250g', checked: false },
    { id: '4', name: 'Fresh basil leaves', amount: '1 handful', checked: false },
    { id: '5', name: 'Extra virgin olive oil', amount: '3 tbsp', checked: false },
    { id: '6', name: 'Garlic cloves', amount: '2 cloves', checked: false },
    { id: '7', name: 'Salt', amount: 'to taste', checked: false },
    { id: '8', name: 'Black pepper', amount: 'to taste', checked: false },
    { id: '9', name: 'All-purpose flour', amount: 'for dusting', checked: false },
  ] as Ingredient[],
  steps: [
    {
      id: '1',
      title: 'Prepare the dough',
      description: 'Remove pizza dough from refrigerator and let it come to room temperature. This makes it easier to stretch. Dust your work surface with flour.',
      duration: 1800, // 30 minutes
      tip: 'Room temperature dough is more elastic and easier to work with!',
    },
    {
      id: '2',
      title: 'Preheat the oven',
      description: 'Preheat your oven to the highest temperature (usually 475-500°F or 245-260°C). If you have a pizza stone, place it in the oven now.',
      duration: 900, // 15 minutes
      tip: 'A very hot oven is the secret to a crispy crust!',
    },
    {
      id: '3',
      title: 'Make the sauce',
      description: 'Crush the tomatoes by hand in a bowl. Mince the garlic and add it to the tomatoes. Add 1 tbsp olive oil, salt, and pepper. Mix well. No cooking needed!',
      duration: 300, // 5 minutes
      tip: 'Keep the sauce simple - the quality of tomatoes matters most.',
    },
    {
      id: '4',
      title: 'Stretch the dough',
      description: 'On a floured surface, gently stretch the dough into a 12-inch circle. Start from the center and work your way out. Leave a slightly thicker edge for the crust.',
      duration: 180, // 3 minutes
      tip: 'Don\'t use a rolling pin - it removes air bubbles that make the crust fluffy!',
    },
    {
      id: '5',
      title: 'Assemble the pizza',
      description: 'Transfer dough to a pizza peel or parchment paper. Spread a thin layer of sauce, leaving a 1-inch border. Tear the mozzarella and distribute evenly. Drizzle with olive oil.',
      duration: 120, // 2 minutes
      tip: 'Less is more - don\'t overload with toppings or the crust won\'t crisp!',
    },
    {
      id: '6',
      title: 'Bake the pizza',
      description: 'Carefully transfer pizza to the hot oven (on the stone if using). Bake until the crust is golden and cheese is bubbling, about 10-12 minutes.',
      duration: 660, // 11 minutes
      tip: 'Watch carefully in the last few minutes to avoid burning!',
    },
    {
      id: '7',
      title: 'Finish and serve',
      description: 'Remove pizza from oven and immediately top with fresh basil leaves. Drizzle with a bit more olive oil if desired. Let cool for 1-2 minutes, then slice and serve.',
      duration: 120, // 2 minutes
      tip: 'Add basil after baking to keep it fresh and vibrant!',
    },
  ] as Step[],
};

export default function App() {
  const [view, setView] = useState<'ingredients' | 'cooking'>('ingredients');
  const [ingredients, setIngredients] = useState<Ingredient[]>(RECIPE.ingredients);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const toggleIngredient = (id: string) => {
    setIngredients(prev =>
      prev.map(ing => (ing.id === id ? { ...ing, checked: !ing.checked } : ing))
    );
  };

  const checkedCount = ingredients.filter(i => i.checked).length;
  const allIngredientsChecked = checkedCount === ingredients.length;

  const handleStartCooking = () => {
    if (!allIngredientsChecked) {
      alert('Please check off all ingredients before starting!');
      return;
    }
    setView('cooking');
  };

  const handleBackToIngredients = () => {
    setView('ingredients');
    setCurrentStepIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1>{RECIPE.name}</h1>
              <div className="flex gap-4 text-gray-600 mt-1">
                <span>Prep: {RECIPE.prepTime}</span>
                <span>•</span>
                <span>Cook: {RECIPE.cookTime}</span>
                <span>•</span>
                <span>Serves: {RECIPE.servings}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setView('ingredients')}
              className={`px-6 py-3 transition-colors ${
                view === 'ingredients'
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ingredients ({checkedCount}/{ingredients.length})
            </button>
            <button
              onClick={() => setView('cooking')}
              className={`px-6 py-3 transition-colors ${
                view === 'cooking'
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cooking Steps ({currentStepIndex}/{RECIPE.steps.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'ingredients' ? (
          <IngredientChecklist
            ingredients={ingredients}
            onToggle={toggleIngredient}
            onStartCooking={handleStartCooking}
            allChecked={allIngredientsChecked}
          />
        ) : (
          <CookingSteps
            steps={RECIPE.steps}
            currentStepIndex={currentStepIndex}
            onStepChange={setCurrentStepIndex}
            onBackToIngredients={handleBackToIngredients}
          />
        )}
      </div>
    </div>
  );
}
