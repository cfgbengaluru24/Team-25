import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pymongo import MongoClient
import certifi
import os
from dotenv import load_dotenv

load_dotenv()
 mongo = os.getenv('MONGO_URL')

# MongoDB connection
ca = certifi.where()
client = MongoClient(mongo, tlsCAFile=ca)
db = client['cfg']
collection = db['trainee']

# Fetch data from MongoDB
data = list(collection.find({}, {"_id": 0, "id": 1, "communication": 1, "ethics_gendersensitivity": 1, "criticalthinking": 1, "attempt_date": 1, "first_attempt": 1}))
df = pd.DataFrame(data)
df['attempt_date'] = pd.to_datetime(df['attempt_date'], format='%d/%m/%Y')

# Calculate cumulative/average score
df['ALL'] = df[['communication', 'ethics_gendersensitivity', 'criticalthinking']].mean(axis=1)

# Set page configuration
st.set_page_config(page_title="Student Assessment Analysis", layout="wide")

# Sidebar menu
st.sidebar.title("Navigation")
options = ["Home", "Filter by Percentage", "Attempts by Date", "Pass Rate", "Score Distribution", "Raw Data"]
selection = st.sidebar.radio("Go to", options)

# Main content
if selection == "Home":
    st.title('Welcome to the Student Assessment Analysis Dashboard')
    st.write("""
    Use the sidebar to navigate through different sections of the dashboard.
    - *Filter by Percentage*: Visualize students scoring above a certain percentage.
    - *Attempts by Date*: See the number of students who attempted on each date.
    - *Pass Rate*: Check how many students passed on their first attempt.
    - *Score Distribution*: Explore the distribution of scores across assessments.
    - *Raw Data*: View the raw dataset.
    """)

if selection == "Filter by Percentage":
    st.header('Students Scoring More Than Selected Percentage')
    percentage = st.slider('Select a percentage', 0, 100, 50)
    criteria = st.selectbox('Select Criterion', ['communication', 'ethics_gendersensitivity', 'criticalthinking', 'ALL'])
    filtered_df = df[df[criteria] > percentage]
    st.write(f'Number of students scoring more than {percentage}% in {criteria}: {len(filtered_df)}')

    fig = px.pie(names=['Above Threshold', 'Below Threshold'], values=[len(filtered_df), len(df)-len(filtered_df)], title='Percentage of Students Scoring Above Threshold')
    st.plotly_chart(fig)

if selection == "Attempts by Date":
    st.header('Number of Students Attempted on Each Date')
    attempts_per_date = df['attempt_date'].value_counts().sort_index()
    
    fig = px.bar(x=attempts_per_date.index, y=attempts_per_date.values, labels={'x': 'Attempt Date', 'y': 'Number of Students'}, title='Attempts Per Date')
    st.plotly_chart(fig)

if selection == "Pass Rate":
    st.header('Students Passed in the First Attempt')
    first_attempt_pass = df['first_attempt'].value_counts()
    
    fig = px.pie(names=['Passed', 'Failed'], values=first_attempt_pass, title='First Attempt Pass Rate')
    st.plotly_chart(fig)

if selection == "Score Distribution":
    st.header('Score Distribution Across Assessments')
    fig = go.Figure()
    for col in ['communication', 'ethics_gendersensitivity', 'criticalthinking']:
        fig.add_trace(go.Box(y=df[col], name=col))
    
    fig.update_layout(title='Score Distribution', yaxis_title='Scores')
    st.plotly_chart(fig)

if selection == "Raw Data":
    st.header('Raw Data')
    st.write(df)

# Additional CSS styling
st.markdown("""
    <style>
    .sidebar .sidebar-content {
        background-color: #f0f2f6;
    }
    </style>
    """, unsafe_allow_html=True)