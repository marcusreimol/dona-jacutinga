import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';


let API_KEY = 'AIzaSyDdcX5XfDFcDvDJEIIV70ODIlOqJN01i6w';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Matutando...';

  try {
   // Load the image as a base64 string
let imageUrl = form.elements.namedItem('chosen-image').value;
let imageBase64 = await fetch(imageUrl)
  .then(r => r.arrayBuffer())
  .then(a => Base64.fromByteArray(new Uint8Array(a)));

// Assemble the prompt by combining the text with the chosen image
let contents = [
  {
    role: 'user',
    parts: [
      { inline_data: { mime_type: 'image/jpeg', data: imageBase64, } },
      { text: promptInput.value }
    ]
  }
];



    
    

    // Define the context
const context = [
  {
    role: 'context',
    parts: [
      { text: 'Artificial intelligence (AI) is rapidly changing the healthcare industry. AI-powered tools are being used to diagnose diseases, develop new treatments, and improve patient care. In this blog post, we will explore some of the benefits of using AI in healthcare.' },
    ]
  }
];

// Call the gemini-pro-vision model, and get a stream of results
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-pro-vision",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ],
});

    




const result = await model.generateContentStream({ contents});

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};
