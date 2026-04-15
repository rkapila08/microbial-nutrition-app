import { QuizClient } from "./quiz-client";

export const metadata = {
  title: "Take the Quiz — MicroType",
  description:
    "Answer 32 questions to discover your gut microbiome type and get a personalised nutrition plan.",
};

export default function QuizPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <QuizClient />
    </main>
  );
}
