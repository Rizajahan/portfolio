// RizaBot's knowledge. Order matters: specific topics are checked BEFORE the generic "about Riza" pattern.
const R = [
 [/\b(hi|hello|hey|namaste|salam)\b/i, "Hello! 👋 I'm RizaBot. Ask me about Riza's skills, projects, education or how to contact her.", 'happy'],
 [/(contact|reach|hire|phone|call|talk to her|get in touch)/i, "I can send Riza a message right now, and she'll be notified instantly.", 'happy', 'contact'],
 [/(helmet|yolo)/i, "Helmet Detection: a real-time YOLOv5 + OpenCV system that spots riders without helmets from images, video or webcam, with a Streamlit web demo.", 'happy'],
 [/(janlink|complaint|scam)/i, "JanLink is a cloud complaint and scam reporting system. Citizens submit complaints and track them with a unique token. Built with HTML, CSS, JS and Firebase. Live: https://janlink-a3e84.web.app/", 'happy'],
 [/(patent|emergency|dial)/i, "Riza drafted a patent proposal for a mobile safety system that sends live location and identity to emergency contacts when a special dial code is triggered.", 'happy'],
 [/(fruit)/i, "Fruit Recognition: a TensorFlow/Keras classifier trained on Kaggle's fruits dataset with data augmentation and Matplotlib analysis.", 'happy'],
 [/(resin|jewelry)/i, "Riza also built a website for a resin jewelry business, showcasing handmade pieces online.", 'happy'],
 [/(skill|tech|stack|language|know|tools)/i, "Web: HTML5, CSS3, JavaScript. Programming: Java, Python, OOP. AI/ML: OpenCV, YOLOv5, TensorFlow/Keras, PyTorch, Roboflow. Cloud: Firebase Auth, Firestore, Hosting. Tools: Git, GitHub, IntelliJ, Streamlit.", 'happy'],
 [/(project|work|built|portfolio)/i, "Main projects: Helmet Detection (YOLOv5), JanLink (Firebase), Fruit Recognition (TensorFlow), an Emergency Dial-Code patent draft, and a resin jewelry business website. Ask about any of them!", 'happy'],
 [/(experience|intern|job|mintways|eduskills)/i, "Riza was a Machine Learning Intern at Mintways Technologies (2025, helmet detection) and an AI/ML virtual intern with EduSkills (Apr to Jun 2025).", 'happy'],
 [/(educat|study|degree|college|univers|mca|bca|cgpa|school)/i, "MCA in Generative AI at Amity University Noida (2026 to present). BCA at Amity University Gwalior (2023 to 2026, CGPA 9.04).", 'happy'],
 [/(resume|cv)/i, "You can download her resume with the Resume button at the top of this page.", 'happy'],
 [/(github|linkedin|instagram|youtube|social)/i, "GitHub: github.com/Rizajahan. LinkedIn, Instagram and YouTube links are in the Contact section below.", 'happy'],
 [/(service|offer|freelance|website|build)/i, "Riza offers Web Development, Front-End Development, AI/ML Solutions and Java Development. Want me to pass a message to her?", 'happy'],
 [/(who is riza|who are you|introduce|yourself|about riza|about you)/i, "Sayyed Riza Jahan is an MCA (Generative AI) student at Amity University Noida who builds useful things: web apps, Java programs and machine-learning projects. She learns best by building real projects.", 'happy'],
];
export function reply(text) {
  for (const [re, answer, mood, action] of R) if (re.test(text)) return { answer, mood, action };
  return { answer: "I'm not sure about that one 🤔 Try asking about skills, projects, experience or education, or I can send Riza your question.", mood: 'think' };
}