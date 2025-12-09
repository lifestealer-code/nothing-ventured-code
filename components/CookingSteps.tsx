import { useState } from 'react';
import { Timer } from './Timer';
import { ChevronLeft, ChevronRight, Lightbulb, ArrowLeft, CheckCircle } from 'lucide-react';
import { Step } from '../App';

interface CookingStepsProps {
  steps: Step[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onBackToIngredients: () => void;
}

export function CookingSteps({
  steps,
  currentStepIndex,
  onStepChange,
  onBackToIngredients,
}: CookingStepsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (!isLastStep) {
      setCompletedSteps(prev => new Set([...prev, currentStep.id]));
      onStepChange(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      onStepChange(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep.id]));
  };

  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const isStepCompleted = completedSteps.has(currentStep.id);
  const allStepsCompleted = completedSteps.size === steps.length;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span className="text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mt-4">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => onStepChange(index)}
              className={`flex-1 h-2 rounded-full transition-all ${
                completedSteps.has(step.id)
                  ? 'bg-green-500'
                  : index === currentStepIndex
                  ? 'bg-orange-500'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title={`Step ${index + 1}: ${step.title}`}
            />
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="text-orange-500 mb-2">
              Step {currentStepIndex + 1}
            </div>
            <h2 className="mb-4">{currentStep.title}</h2>
          </div>
          {isStepCompleted && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span>Completed</span>
            </div>
          )}
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{currentStep.description}</p>

        {/* Tip */}
        {currentStep.tip && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-amber-900 mb-1">Pro Tip</div>
                <p className="text-amber-800">{currentStep.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Timer */}
        {currentStep.duration && (
          <Timer
            duration={currentStep.duration}
            stepTitle={currentStep.title}
            onComplete={handleComplete}
          />
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 border-2 transition-all ${
              isFirstStep
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isLastStep}
            className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all ${
              isLastStep
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            Next Step
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Completion Message */}
      {allStepsCompleted && (
        <div className="bg-green-50 border-2 border-green-500 rounded-xl shadow-lg p-8 text-center">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-green-900 mb-2">Congratulations!</h2>
          <p className="text-green-800 mb-6">
            You&apos;ve completed all the steps. Your pizza is ready to enjoy!
          </p>
          <button
            onClick={onBackToIngredients}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Start a New Recipe
          </button>
        </div>
      )}

      {/* Back to Ingredients Button */}
      <button
        onClick={onBackToIngredients}
        className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mx-auto transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Ingredients
      </button>
    </div>
  );
}
