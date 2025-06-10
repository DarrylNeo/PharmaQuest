using System;
using System.Collections.Generic;
using System.Text.Json;
using System.IO;

namespace PharmaQuest
{
    public class Question
    {
        public string? QuestionText { get; set; }
        public string[]? Options { get; set; }
        public int CorrectAnswerIndex { get; set; }
        public string? Explanation { get; set; }
        public string? Category { get; set; }
    }

    public class QuizManager
    {
        private List<Question> questions;
        private Random random;
        private HashSet<int> usedQuestions;

        public QuizManager()
        {
            questions = new List<Question>();
            random = new Random();
            usedQuestions = new HashSet<int>();
            LoadQuestions();
        }

        private void LoadQuestions()
        {
            try
            {
                string jsonPath = Path.Combine("Content", "Data", "OPRA2024Questions.json");
                if (File.Exists(jsonPath))
                {
                    string jsonContent = File.ReadAllText(jsonPath);
                    var loadedQuestions = JsonSerializer.Deserialize<List<Question>>(jsonContent);
                    if (loadedQuestions != null)
                    {
                        questions = loadedQuestions;
                        Console.WriteLine($"Successfully loaded {questions.Count} questions.");
                    }
                }
                else
                {
                    Console.WriteLine("Questions file not found. Using default questions.");
                    AddDefaultQuestions();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error loading questions: {e.Message}");
                Console.WriteLine("Using default questions.");
                AddDefaultQuestions();
            }
        }

        private void AddDefaultQuestions()
        {
            questions.Add(new Question
            {
                QuestionText = "Which medication is first-line for treating hypertension in the elderly?",
                Options = new[] { "Amlodipine", "Lisinopril", "Metoprolol", "Losartan" },
                CorrectAnswerIndex = 0,
                Explanation = "Amlodipine is often recommended for its tolerability in older adults.",
                Category = "Clinical"
            });

            questions.Add(new Question
            {
                QuestionText = "What is the maximum daily dose of paracetamol for adults?",
                Options = new[] { "2g", "3g", "4g", "5g" },
                CorrectAnswerIndex = 2,
                Explanation = "The maximum daily dose of paracetamol for adults is 4g. Exceeding this may cause liver toxicity.",
                Category = "Dispensing"
            });
        }

        public Question? GetRandomQuestion()
        {
            if (questions.Count == 0)
                return null;

            // If all questions have been used, reset the used questions set
            if (usedQuestions.Count >= questions.Count)
            {
                usedQuestions.Clear();
            }

            // Keep trying to find an unused question
            int maxAttempts = questions.Count;
            int attempts = 0;
            while (attempts < maxAttempts)
            {
                int index = random.Next(questions.Count);
                if (!usedQuestions.Contains(index))
                {
                    usedQuestions.Add(index);
                    return questions[index];
                }
                attempts++;
            }

            // If we couldn't find an unused question, return the first available one
            return questions[0];
        }

        public List<Question> GetAllQuestions()
        {
            return new List<Question>(questions);
        }

        public void ResetProgress()
        {
            usedQuestions.Clear();
        }
    }
}
