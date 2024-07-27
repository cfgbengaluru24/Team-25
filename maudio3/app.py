from flask import Flask, request, render_template
import speech_recognition as sr
import pyttsx3
from fireworks.client import Fireworks
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Initialize the recognizer
r = sr.Recognizer()
FIREWORKS_API = os.getenv('FIREWORKS_API')

def user_message(question, answer):
    feedback1 = (
        f"""You are a Communication Skills Analysing Bot.Your task is to assess the student's input speech for a given question.
        The speech will be provided to you as text and generate a report based on the assessment.
        In the Communication assessment report, I need you to analyse the input text, and give me :
        1. an overall score
        2. a fluency score
        3. level of vocabulary
        4. general feedback with suggested reading material related to the question.

        IF THE INPUT IS IN ENGLISH, PLEASE RESPOND IN ENGLISH.
        DON'T BE TOO STRICT. BE LENIENT WITH THE SCORES.

        Give me the entire output in not more than 50 words.

        ####
        Here are some examples:

        Input Question: Tell us why you are the best person for this job

        Input Answer: I believe I'm a strong candidate for this role because I've developed relevant skills through my coursework and projects as a sophomore. For example, in my recent project on to-do list application, I gained hands-on experience in web development, which aligns well with the responsibilities of this position. I'm highly motivated to apply my knowledge and eager to learn more in a practical setting. I'm particularly impressed by the company, and I'm confident that my enthusiasm, combined with my strong work ethic, will allow me to contribute effectively to your team.

        Output:

        Overall Score: 8/10
        Fluency Score: 8/10
        Level of Vocabulary: Intermediate
        Feedback: Clear and confident with relevant examples. To enhance, elaborate more on specific skills and achievements. Suggested reading: "The 7 Habits of Highly Effective People" by Stephen Covey.


        Input Question: What is your favorite color and why?

        Input Answer: My favorite color is blue. I like blue because it is the color of the sky and the sea. It makes me feel calm and happy.

        Output:

        Overall Score: 6/10
        Fluency Score: 5/10
        Level of Vocabulary: Basic
        Feedback: Simple and clear answer. To improve, mention other things you like that are blue and explain how they make you feel. Use more descriptive language and varied vocabulary to express your feelings about the color blue. Consider adding personal experiences or memories related to the color.

        Input Question: Do you have a pet? Describe it.

        Input Answer: Yes, I have a pet dog. His name is Max. He is small and brown. Max likes to play with a ball and he is very friendly.

        Output:

        Overall Score: 3/10
        Fluency Score: 6/10
        Level of Vocabulary: Poor
        Feedback: Good answer with clear description. To enhance, add more details about Max's behavior, daily routine, and any special moments you share. Describe how Max makes you feel and any specific games or activities you do together. Use descriptive adjectives to paint a vivid picture.

        ###

        <<<

        Input Question: {question}
        Input Student Answer: {answer}
        >>>
        """
        
    )
    return feedback1

def call_llm(question, answer):
    client = Fireworks(api_key= FIREWORKS_API)
    message_modified = user_message(question, answer)
    response = client.chat.completions.create(
        model="accounts/fireworks/models/llama-v3p1-8b-instruct",
        messages=[{"role": "user", "content": message_modified}],
    )
    bot_response = response.choices[0].message.content
    return bot_response

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'file' not in request.files:
            return "No file part"

        file = request.files['file']
        if file.filename == '':
            return "No selected file"

        if file:
            # Save the uploaded file
            audio_file_path = 'uploaded_audio.wav'
            file.save(audio_file_path)

            try:
                # Use the audio file as source for input.
                with sr.AudioFile(audio_file_path) as source:
                    r.adjust_for_ambient_noise(source)
                    audio_data = r.record(source)
                    MyText = r.recognize_google(audio_data)
                    MyText = MyText.lower()
                    Q = "where do you see yourself"

                    ans = call_llm(Q, MyText)

                    # Render the result on the frontend
                    return render_template('result.html', transcription=MyText, analysis=ans)

            except sr.RequestError as e:
                return f"Could not request results; {e}"
            except sr.UnknownValueError:
                return "Unknown error occurred"

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5007)
