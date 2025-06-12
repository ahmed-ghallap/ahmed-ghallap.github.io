import Dexie from 'dexie';

const cv = {
  "name": "ahmed mohamed ali",
  "nationality": "Egyptian",
  "city": "Alexandria",
  "education": {
    "field": "Computer Engineering",
    "level": "Undergraduate",
    "year": 4
  },
  "working_style": "Solo",
  "programming_skills": {
    "Python": "Basic",
    "Django": "Beginner",
    "FastAPI": "Beginner",
    "Flask": "Beginner"
  },
  "operating_systems": [
    "Ubuntu"
  ],
  "projects": [
    {
      "name": "Educational Platform",
      "features": [
        "Paragraph-based lesson creation",
        "Question attachment per paragraph",
        "Automatic test generation",
        "Automatic presentation creation",
        "PDF compilation"
      ]
    },
    {
      "name": "Jellyfin Mobile Uploader",
      "description": "A plugin to upload videos to Jellyfin server via mobile"
    },
    {
      "name": "USB Trigger Script",
      "description": "A Python script that runs when a USB with a specific name is connected"
    },
    {
      "name": "VOD Platform",
      "tech_stack": ["FastAPI", "Uvicorn"],
      "features": ["Video upload without live transcoding"]
    },
    {
      "name": "Quran Memorization App",
      "features": [
        "Student data tracking (name, phone, level)",
        "Memorization progress tracking"
      ]
    }
  ],
  "hobbies": [
    "Drawing",
    "Table Tennis"
  ]
}

const token = 'AIzaSyABTsQNohId_6z5ArC_pVMcrjXnYLPO-xg'; // Replace with your actual API keyj
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${token}`;

const botBody = (message, cv) => ({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          contents: [
          {
            parts: [{ text: `
                You are a friendly and specialized AI assistant for CV analysis.
                Your task is to answer the following question **strictly** based on the information provided in the given CV.

                ---
                **CV:**
                ${cv}
                ---

                **Question:**
                ${message}

                **Answer:**
                Respond in the language of the question. If the question's language is ambiguous or not recognized, default to English.
                If the answer is not explicitly present in the CV, simply state "I don't know."
              ` }]
         }
        ]
      })
  })

class Chat {
  constructor() {
    this.db = new Dexie('chatDb');
    this.db.version(1).stores({
      messages: '++id, content, timestamp'
    })
  }

  add(message) {
    const id = this.addMessage(message, true)
    if (!id)
      throw new Error("فشل في إضافة الرسالة");

    return this.botResponse(message)
      .then(response => {
        const data = response.candidates[0].content.parts[0].text
        this.addMessage(data, false)
        return data;
        console.log("تم إضافة الرسالة بنجاح:", response);
      })
      .catch(error => {
        console.error("خطأ في استجابة البوت:", error);
        this.addMessage("something went wrong please try again", false)
        return "something went wrong please try again";
      });

  }

  addMessage(message, owner) {
    let _owner = 'bot'
    if (owner) 
      _owner = 'user';

    return this.db.messages.add({content: message, timestamp: new Date(), owner: _owner});
  }

  getAll() {
    return this.db.messages.limit(200).toArray();
  }

  get(id) {
    return this.db.messages.get(id);
  }

  clear() {
    return this.db.messages.clear();
  }

  botResponse(message) {
    return fetch(apiUrl, botBody(message, JSON.stringify(cv)))
    .then(response => {
      if (!response.ok) {
        throw new Error("فشل في الإرسال: " + response.status);
      }
      return response.json();
    })
  }
}


export default Chat;