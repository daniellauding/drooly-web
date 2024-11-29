import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const QUIZ_QUESTIONS = [
  {
    question: "Which taste sensation is associated with foods like lemons and vinegar?",
    options: ["Sweet", "Sour", "Salty", "Bitter"],
    answer: "Sour"
  },
  {
    question: "What gives dishes like soy sauce and olives their distinctive taste?",
    options: ["Umami", "Sweet", "Sour", "Salty"],
    answer: "Umami"
  },
  {
    question: "Which ingredient is primarily responsible for enhancing other flavors in a dish?",
    options: ["Sugar", "Salt", "Vinegar", "Pepper"],
    answer: "Salt"
  }
];

export function FlavorQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleAnswer = () => {
    if (!selectedAnswer) {
      toast({
        title: "Select an answer",
        description: "Please choose an option before continuing",
        variant: "destructive"
      });
      return;
    }

    if (selectedAnswer === QUIZ_QUESTIONS[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      setIsComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setIsComplete(false);
  };

  return (
    <Card className="p-6 bg-purple-50 min-h-[350px] flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-purple-700">Flavor Quiz</h3>
      
      {!isComplete ? (
        <>
          <p className="text-purple-900 mb-4">{QUIZ_QUESTIONS[currentQuestion].question}</p>
          
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={setSelectedAnswer}
            className="space-y-3 flex-grow"
          >
            {QUIZ_QUESTIONS[currentQuestion].options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>

          <Button 
            onClick={handleAnswer}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            {currentQuestion === QUIZ_QUESTIONS.length - 1 ? "Finish" : "Next"}
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow text-center">
          <h4 className="text-2xl font-bold text-purple-700 mb-4">
            Quiz Complete!
          </h4>
          <p className="text-purple-900 mb-6">
            You scored {score} out of {QUIZ_QUESTIONS.length}
          </p>
          <Button 
            onClick={resetQuiz}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Try Again
          </Button>
        </div>
      )}
    </Card>
  );
}