import streamlit as st
from fireworks.client import Fireworks
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from io import BytesIO
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from reportlab.lib.utils import ImageReader

# Email credentials
EMAIL_ADDRESS = os.getenv("GOOGLE_EMAIL")
EMAIL_PASSWORD = os.getenv("GOOGLE_PASSWORD")

# Load environment variables
load_dotenv()
FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY")

# Initialize Fireworks client
client = Fireworks(api_key=os.environ['FIREWORKS_API_KEY'])

# MongoDB setup
CONNECTION_STRING = os.getenv("MONGODB_CONNECTION_STRING")
mongo_client = MongoClient(CONNECTION_STRING)
db = mongo_client['cfg']
collection = db['trainee']

# Define questions and correct answers
questions = [
    ("A farmer had 15 sheep, and all but 8 died. How many are left?", "8"),
    ("What number comes next in the series: 2, 3, 5, 9, 17, ___?", "33"),
    ("If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?", "Yes"),
    ("In a race, if you pass the person in 2nd place, what place are you in?", "2nd"),
    ("A bat and a ball cost ₹1100 in total. The bat costs ₹1000 more than the ball. How much does the ball cost?", "50"),
    ("If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?", "5"),
]

# Generate feedback using Fireworks API
def call_llm(user_responses):
    responses_text = "\n".join(f"{i+1}. {response}" for i, response in enumerate(user_responses))
    questions_text = "\n".join(f"{i+1}. {q}" for i, (q, a) in enumerate(questions))
    answers_text = "\n".join(f"{i+1}. {a}" for i, (q, a) in enumerate(questions))
    message = (
        f"""
        You are a Social Skills Analysing Bot. 

        You will be provided with responses to a series of questions. Your task is to provide feedback based on these responses.

        The questions and their correct answers are as follows:
        
        Questions:
        {questions_text}

        Correct Answers:
        {answers_text}

        Please analyze the following responses and provide insightful feedback:

        Responses:
        {responses_text}

        Provide your feedback in the following format:

        <response>

        Ensure that the feedback is concise and in no more than 100 words.
        """
    )
    response = client.chat.completions.create(
        model="accounts/fireworks/models/llama-v3p1-8b-instruct",
        messages=[{"role": "user", "content": message}],
    )
    return response.choices[0].message.content

# Calculate score and scale it to 100
def calculate_score(user_responses):
    correct_count = sum(1 for i, response in enumerate(user_responses) if response.strip() == questions[i][1])+1
    total_questions = len(questions)
    score_percentage = (correct_count / total_questions) * 100
    rounded_score_percentage = round(score_percentage)
    return correct_count, rounded_score_percentage

# Update score in MongoDB
def update_score_in_db(trainee_id, rounded_score_percentage):
    collection.update_one(
        {"id": trainee_id},
        {"$set": {"criticalthinking": rounded_score_percentage}}
    )

# Streamlit UI
def main():
    st.title("Critical Thinking Assessment")
    st.write("This quiz assesses your critical thinking abilities.")

    # Initialize session state
    if "question_index" not in st.session_state:
        st.session_state.question_index = 0
        st.session_state.responses = []
        st.session_state.submitted = False
        st.session_state.trainee_id = None  # Add trainee_id to session state

    # Input for trainee ID
    if st.session_state.trainee_id is None:
        st.session_state.trainee_id = st.number_input("Enter Trainee ID")
        if not st.session_state.trainee_id:
            st.warning("Please enter the trainee ID to proceed.")
            st.stop()

    if st.session_state.submitted:
        st.write("Quiz complete!")
        # Generate and display feedback
        feedback = call_llm(st.session_state.responses)
        st.write(f"Feedback: {feedback}")
        
        # Calculate and display the score
        correct_count, rounded_score_percentage = calculate_score(st.session_state.responses)
        st.write(f"Your Score: {correct_count}/{len(questions)} ({rounded_score_percentage}%)")
        
        # Update score in MongoDB
        update_score_in_db(st.session_state.trainee_id, rounded_score_percentage)
        email()
        st.stop()

    # Display current question
    current_question, _ = questions[st.session_state.question_index]
    st.write(f"**Question {st.session_state.question_index + 1} of {len(questions)}:**")
    st.write(current_question)
    
    # User input
    user_response = st.text_area(
        "Your response:",
        value=st.session_state.responses[st.session_state.question_index] if len(st.session_state.responses) > st.session_state.question_index else "",
        key=f"response_{st.session_state.question_index}"
    )
    
    # Handle "Next" and "Submit" buttons
    if st.session_state.question_index == len(questions) - 1:
        if st.button("Submit"):
            if user_response:
                st.session_state.responses.append(user_response)
                st.session_state.submitted = True
            else:
                st.warning("Please provide a response before submitting.")
    else:
        if st.button("Next"):
            if user_response:
                if len(st.session_state.responses) > st.session_state.question_index:
                    st.session_state.responses[st.session_state.question_index] = user_response
                else:
                    st.session_state.responses.append(user_response)
                st.session_state.question_index += 1
            else:
                st.warning("Please provide a response before proceeding.")


def email():
    print("Retrieving the first document from the database...")
    user_data = collection.find_one()

    if user_data:
        print("User data found:")
        print(user_data)
        name = user_data.get("first_name", "User")
        user_email = user_data.get("email", "No email provided")
        ethics_score = user_data.get("ethics_gendersensitivity", 0)
        communication_score = user_data.get("communication", 0)
        criticalthinking_score = user_data.get("criticalthinking", 0)

        print(f"Name: {name}")
        print(f"Email: {user_email}")
        print(f"Ethics Score: {ethics_score}")
        print(f"Communication Score: {communication_score}")
        print(f"Critical Thinking Score: {criticalthinking_score}")

        min_threshold = 75
        
        print(ethics_score, communication_score, criticalthinking_score)
        
        failed_criteria = []
        
        if ethics_score >= min_threshold:
            send_email(user_email, name, "Ethics and Gender Sensitivity")
        else:
            failed_criteria.append("Ethics and Gender Sensitivity")
        
        if communication_score >= min_threshold:
            send_email(user_email, name, "Communication")
        else:
            failed_criteria.append("Communication")
        
        if criticalthinking_score >= min_threshold:
            send_email(user_email, name, "Critical Thinking")
        else:
            failed_criteria.append("Critical Thinking")
        
        if failed_criteria:
            send_email(user_email, name, "Ethics and Personality Assessment", retry=True, failed_criteria=failed_criteria)
    else:
        print("No data found in the database.")

def send_email(recipient_email, name, criterion, retry=False, failed_criteria=None):
    msg = MIMEMultipart()
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = recipient_email
    msg['Subject'] = "Ethics and Personality Assessment Results"

    if retry:
        body = f"""
        Dear {name},

        Unfortunately, you did not meet the required thresholds for the following criteria in the Ethics and Personality Assessment:

        {', '.join(failed_criteria)}

        Please try again next week.

        Best regards,
        EXPA Team
        """
    else:
        body = f"""
        Dear {name},

        Congratulations on completing the Ethics and Personality Assessment for {criterion}.

        Please find attached your certification.

        Best regards,
        EXPA Team
        """
    
    msg.attach(MIMEText(body, 'plain'))

    if not retry:
        pdf_buffer = generate_certification(name, criterion)
        attachment = MIMEApplication(pdf_buffer.read(), _subtype="pdf")
        attachment.add_header('Content-Disposition', 'attachment', filename="certification.pdf")
        msg.attach(attachment)

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
        print(f"Email sent to {recipient_email} for {criterion}.")
    except Exception as e:
        print(f"Failed to send email: {e}")

def generate_certification(name, criterion):
    buffer = BytesIO()
    width, height = letter
    c = canvas.Canvas(buffer, pagesize=letter)
    
    # Add border
    c.setStrokeColor(colors.gold)
    c.setLineWidth(3)
    c.rect(0.5*inch, 0.5*inch, width-inch, height-inch)
    
    # Add title
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width/2, height-3*inch, "Certificate of Achievement")
    
    # Add content
    c.setFont("Helvetica", 16)
    c.drawCentredString(width/2, height-4*inch, "This is to certify that")
    
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width/2, height-4.5*inch, name)
    
    c.setFont("Helvetica", 16)
    c.drawCentredString(width/2, height-5*inch, f"has successfully completed the assessment for")
    
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width/2, height-5.5*inch, criterion)
    
    c.setFont("Helvetica", 14)
    c.drawCentredString(width/2, height-6.5*inch, "Congratulations on your outstanding performance!")
    
    # Add logo
    logo = ImageReader("logo.png")  # Make sure to have the logo file in the same directory
    logo_width = 1 * inch  # Adjust size as needed
    logo_height = 1 * inch  # Adjust size as needed
    c.drawImage(logo, (width - logo_width) / 2, 2*inch, width=logo_width, height=logo_height)
    
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(width/2, 1.5*inch, "Certification by EXPA")
    
    c.save()
    buffer.seek(0)
    return buffer

if __name__ == "__main__":
    main()