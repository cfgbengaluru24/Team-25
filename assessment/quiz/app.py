from pymongo import MongoClient
import streamlit as st
import json
import random
import os
from dotenv import load_dotenv
from fireworks.client import Fireworks

# Load environment variables from .env file
load_dotenv()

# MongoDB connection
CONNECTION_STRING = os.getenv("MONGODB_CONNECTION_STRING")
mongo_client = MongoClient(CONNECTION_STRING)
db = mongo_client['cfg']
collection = db['trainee']

# Fireworks API key
FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY")
fireworks_client = Fireworks(api_key=FIREWORKS_API_KEY)

# Load quiz data
def load_quiz_data(filename):
    with open(filename, "r") as file:
        return json.load(file)

# Shuffle questions randomly
def shuffle_questions(questions):
    return random.sample(questions, len(questions))

# Calculate scores
def calculate_scores(answers, questions):
    ethics_score = 0
    gender_sensitivity_score = 0

    for i, answer in enumerate(answers):
        question = questions[i]
        if answer == question["correctAnswer"]:
            if question["section"] == "ethics":
                ethics_score += 1
            elif question["section"] == "genderSensitivity":
                gender_sensitivity_score += 1

    return ethics_score, gender_sensitivity_score

# Generate feedback using Fireworks API
def call_llm(ethics_score, gender_sensitivity_score):
    message = (
        f"""
        You are a Social Skills Analysing Bot. 
        
        You will be provided with the student's score on the ethics test as well as the student's score on the gender sensitivity test.

        Based on the score provided, you need to give feedback for the student in the following format:

        based on your ethics score, your feedback is: <response>

        based on your gender sensitivity score, your feedback is: <response>

        The feedback should be in the following format:

        Give me the entire output in not more than 50 words.

        ####
        Here are some examples:

        >>>

        ethics_score = 1/2
        gender_sensitivity_score = 0/2

        based on your ethics score, your feedback is: You have a solid understanding of ethical principles, as indicated by your score of 1/2. To further improve, consider engaging in discussions about complex ethical dilemmas and reflecting on real-world scenarios. This will help deepen your understanding and application of ethical concepts.

        based on your gender sensitivity score, your feedback is: Your score of 1/2 suggests a moderate grasp of gender sensitivity. To enhance your awareness, actively seek out resources on gender issues and engage in conversations about gender inclusivity. Practice empathy by listening to diverse perspectives and consider how gender dynamics affect various situations.

        <<<
        
        ####

        <<<

        NOW GIVE FEEDBACK FOR THE FOLLOWING SCORES :

        Input ethics_score: {ethics_score}
        Input gender_sensitivity_score : {gender_sensitivity_score}
        >>>
        """
    )
    response = fireworks_client.chat.completions.create(
        model="accounts/fireworks/models/llama-v3p1-8b-instruct",
        messages=[{"role": "user", "content": message}],
    )
    return response.choices[0].message.content

# Streamlit UI
def main():
    st.title("Ethics And Personality Assessment")
    st.write("This quiz assesses your understanding of ethics and gender sensitivity.")

    # Input for trainee ID
    trainee_id = st.text_input("Enter Trainee ID")

    if not trainee_id:
        st.warning("Please enter the trainee ID to proceed.")
        st.stop()

    # Load and shuffle questions only once
    if "questions" not in st.session_state:
        quiz_data = load_quiz_data("quiz_data.json")
        st.session_state.questions = shuffle_questions(quiz_data["questions"])
        st.session_state.total_questions = len(st.session_state.questions)
        st.session_state.question_index = 0
        st.session_state.answers = [None] * st.session_state.total_questions
        st.session_state.submitted = False

    # Handle quiz completion
    if st.session_state.submitted:
        st.write("Quiz complete!")
        ethics_score, gender_sensitivity_score = calculate_scores(st.session_state.answers, st.session_state.questions)
        st.write(f"Ethics Score: {ethics_score}/{sum(1 for q in st.session_state.questions if q['section'] == 'ethics')}")
        st.write(f"Gender Sensitivity Score: {gender_sensitivity_score}/{sum(1 for q in st.session_state.questions if q['section'] == 'genderSensitivity')}")

        # Calculate combined score
        combined_score = ethics_score + gender_sensitivity_score

        # Update the document in MongoDB
        result = collection.update_one(
            {"id": int(trainee_id)},
            {"$set": {"ethics_gendersensitivity": combined_score}}
        )

        if result.matched_count > 0:
            st.success(f"Trainee ID {trainee_id} updated successfully.")
        else:
            st.error(f"Trainee ID {trainee_id} not found.")

        # Generate and display feedback
        feedback = call_llm(ethics_score, gender_sensitivity_score)
        st.write(f"Feedback: {feedback}")
        
        st.stop()

    # Display current question
    current_question = st.session_state.questions[st.session_state.question_index]
    st.write(f"**Question {st.session_state.question_index + 1} of {st.session_state.total_questions}:**")
    st.write(current_question["question"])

    # Answer options
    options = current_question["answers"]
    selected_option = st.radio(
        "Select your answer:",
        options=options,
        index=options.index(st.session_state.answers[st.session_state.question_index])
        if st.session_state.answers[st.session_state.question_index] else None,
        key=f"question_{st.session_state.question_index}"
    )

    # Handle "Next" and "Submit" buttons
    if st.session_state.question_index == st.session_state.total_questions - 1:
        if st.button("Submit"):
            if selected_option:
                selected_index = options.index(selected_option) + 1
                st.session_state.answers[st.session_state.question_index] = selected_index
                st.session_state.submitted = True
                # st.experimental_rerun()
            else:
                st.warning("Please select an answer before submitting.")
    else:
        if st.button("Next"):
            if selected_option:
                selected_index = options.index(selected_option) + 1
                st.session_state.answers[st.session_state.question_index] = selected_index
                st.session_state.question_index += 1
                # st.experimental_rerun()
            else:
                st.warning("Please select an answer before proceeding.")

if __name__ == "__main__":
    main()
