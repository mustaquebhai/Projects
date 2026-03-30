import speech_recognition as sr
import pyttsx3
import datetime
import time
import webbrowser 
import pyautogui 
import os
import subprocess
def initialize_engine():
    engine=pyttsx3.init("sapi5")
    voices=engine.getProperty('voices')
    engine.setProperty('voice',voices[1].id)
    rate=engine.getProperty('rate')
    engine.setProperty('rate',rate-50)
    volume=engine.getProperty('volume')
    engine.setProperty('volume',volume+0.25)
    return engine
def speak(text):
    engine=initialize_engine()
    engine.say(text)
    engine.runAndWait()
# speak("hello boss i am here")
def command():
    r=sr.Recognizer()
    with sr.Microphone() as source:
        r.adjust_for_ambient_noise(source,duration=0.5)
        print("listening......", end="",flush=True)
        r.pause_threshold=1.0
        r.phrase_threshold=0.3
        r.sample_rate=48000
        r.dynamic_energy_threshold=True
        r.operation_timeout=5
        r.non_speaking_duration=0.5
        r.dynamic_energy_adjustment=2
        r.energy_threshold=400
        r.phrase_time_limit=10
        # print(sr.Microphone.list_microphone_names())
        audio=r.listen(source)
        try: 
         print("recognize....",end="",flush=True)
         query=r.recognize_google(audio,language='en-in')
         print("\r",end="",flush=True)
         print(f"user said:{query}\n")
        except Exception as e:
           print("say that again")
           return "None"
        return query

def cal_day():
   day=datetime.datetime.today().weekday()+1
   day_dict={
      1:"monday",
      2:"tuesday",
      3:"wednesday",
      4:"thersday",
      5:"friday",
      6:"saturday",
      7:"sunday"
   }
   if day in day_dict.keys():
      day_of_week=day_dict[day]
      return day_of_week
def wishMe():
   hour=int(datetime.datetime.now().hour)
   t=time.strftime("%I:%M %p")
   day=cal_day()

   if (hour>=0) and (hour<+12) and ('AM' in t):
        speak(f"goodmorning boss,it is {day} and the time is {t}")
   elif(hour>=12) and (hour<=16) and ('PM' in t):
        speak(f"goodafternoon boss , it's {day} and the time is {t}")
   else:
       speak(f"gooevening boss , it's {day} and the time is {t}")
    
def social_media():
    query=command().lower()
    ldictionary={
        "open facebook":"https://www.facebook.com",
        "open instagram":"https://www.instagram.com"
    }
    for key in ldictionary:
        if key in query:
            speak(f"opening {key} boss")
            webbrowser.open(ldictionary[key])
def schedule():
    query=command().lower()
    day=cal_day().lower()
    speak("boss today schedule is ")
    week={
        "sunday":"boss from 9am to 9:50 am you have dsa class"
    }  
    list=["schedule","today time table","today rutine","university time table","today schedule"]
    for key in list:
        if key in query:
            speak(week[day])
def volume():
    query=command().lower()
    if "volume up" in query or "increase volume" in query:
        for i in range(5):
         pyautogui.press("volumeup")
         speak("volume increased increased")
    elif "volume down" in query or "decrese volume" in query:
        for i in range(5):
         pyautogui.press("volumedown")
         speak("volume decrese boss")
    elif "mute" in query or "mute volume" in query:
        for i in range(5):
         pyautogui.press("mute")
         speak(" volume muted boss")
def openApp():
   query=command().lower()
   apps={
      "open vscode":"D:\\Programs\\Microsoft VS Code\\Code.exe",
      "open chrome":"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
   }
   for key in apps:
      if key in query:
         speak(f"opening {key} boss")
         os.startfile(apps[key])
    
def closeApp():
   query=command().lower()
   apps={
      "close chrome":"chrome.exe"
   }
   for key,process in apps.items():
      if key in query:
         subprocess.call(["taskkill","/f","/im",process])
         speak(f"{key} closed boss")
   print(query)
if __name__=="__main__":
    # schedule()
    # volume()
   
    while True:
     query=command().lower()
     if "open" in query:
       openApp()
     elif "close" in query:
       closeApp()
    # social_media()
    # wishMe()
    # while True:
    #    command().lower()
       
