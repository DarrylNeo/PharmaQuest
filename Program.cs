using System;
using System.Collections.Generic;
using System.Threading;

namespace PharmaQuest
{
    public class Program
    {
        private static QuizManager? quizManager;
        private static int score = 0;
        private static int totalQuestions = 0;

        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            quizManager = new QuizManager();
            ShowMainMenu();
        }

        static void ShowMainMenu()
        {
            while (true)
            {
                Console.Clear();
                Console.WriteLine("╔════════════════════════════════╗");
                Console.WriteLine("║  Pharma Quest: OPRA Challenge  ║");
                Console.WriteLine("╚════════════════════════════════╝\n");
                Console.WriteLine("1. Start Quiz");
                Console.WriteLine("2. Study Mode");
                Console.WriteLine("3. Exit");
                Console.Write("\nSelect an option (1-3): ");

                string? input = Console.ReadLine()?.Trim();
                switch (input)
                {
                    case "1":
                        StartQuiz();
                        break;
                    case "2":
                        StudyMode();
                        break;
                    case "3":
                        Environment.Exit(0);
                        break;
                    default:
                        Console.WriteLine("\nInvalid option. Please try again.");
                        Thread.Sleep(1000);
                        break;
                }
            }
        }

        static void StartQuiz()
        {
            if (quizManager == null) return;

            score = 0;
            totalQuestions = 0;
            quizManager.ResetProgress();

            while (true)
            {
                Console.Clear();
                var question = quizManager.GetRandomQuestion();
                if (question?.QuestionText == null || question.Options == null) break;

                totalQuestions++;
                Console.WriteLine($"Question {totalQuestions}:");
                Console.WriteLine($"\n{question.QuestionText}\n");

                for (int i = 0; i < question.Options.Length; i++)
                {
                    Console.WriteLine($"{i + 1}. {question.Options[i]}");
                }

                Console.Write("\nYour answer (1-4, or 'q' to quit): ");
                string? input = Console.ReadLine()?.ToLower().Trim();

                if (input == "q") break;

                if (int.TryParse(input, out int answer) && answer >= 1 && answer <= 4)
                {
                    if (answer - 1 == question.CorrectAnswerIndex)
                    {
                        Console.WriteLine("\n✓ Correct! 🎉");
                        score++;
                    }
                    else
                    {
                        Console.WriteLine("\n✗ Incorrect.");
                        Console.WriteLine($"The correct answer was: {question.Options[question.CorrectAnswerIndex]}");
                    }

                    Console.WriteLine($"\nExplanation: {question.Explanation}");
                    Console.WriteLine($"\nCurrent Score: {score}/{totalQuestions} ({(totalQuestions > 0 ? (score * 100.0 / totalQuestions).ToString("F1") : "0")}%)");
                    Console.WriteLine("\nPress any key to continue...");
                    Console.ReadKey(true);
                }
            }

            Console.Clear();
            Console.WriteLine("═══════════════════════");
            Console.WriteLine("     Quiz Complete!     ");
            Console.WriteLine("═══════════════════════");
            Console.WriteLine($"Final Score: {score}/{totalQuestions}");
            Console.WriteLine($"Percentage: {(totalQuestions > 0 ? (score * 100.0 / totalQuestions).ToString("F1") : "0")}%");
            Console.WriteLine("\nPress any key to return to main menu...");
            Console.ReadKey(true);
        }

        static void StudyMode()
        {
            if (quizManager == null) return;

            var questions = quizManager.GetAllQuestions();
            int currentIndex = 0;

            while (true)
            {
                Console.Clear();
                if (currentIndex >= questions.Count) break;

                var question = questions[currentIndex];
                if (question?.QuestionText == null || question.Options == null) continue;

                Console.WriteLine($"═══ Study Card {currentIndex + 1}/{questions.Count} ═══\n");
                Console.WriteLine("Question:");
                Console.WriteLine(question.QuestionText);
                Console.WriteLine("\nOptions:");
                for (int i = 0; i < question.Options.Length; i++)
                {
                    Console.WriteLine($"{i + 1}. {question.Options[i]}");
                }

                Console.WriteLine("\nPress:");
                Console.WriteLine("• SPACE to see answer");
                Console.WriteLine("• ← → arrows to navigate");
                Console.WriteLine("• Q to quit");

                var key = Console.ReadKey(true);

                if (key.Key == ConsoleKey.Spacebar)
                {
                    Console.WriteLine("\n═══ Answer ═══");
                    Console.WriteLine($"Correct Answer: {question.Options[question.CorrectAnswerIndex]}");
                    Console.WriteLine($"\nExplanation: {question.Explanation}");
                    Console.WriteLine("\nPress any key to continue...");
                    Console.ReadKey(true);
                }
                else if (key.Key == ConsoleKey.LeftArrow && currentIndex > 0)
                {
                    currentIndex--;
                }
                else if (key.Key == ConsoleKey.RightArrow && currentIndex < questions.Count - 1)
                {
                    currentIndex++;
                }
                else if (key.Key == ConsoleKey.Q)
                {
                    break;
                }
            }
        }
    }
}
