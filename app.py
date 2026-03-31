from flask import Flask, render_template, request, jsonify
import os

# Flask ऐप को इनिशियलाइज़ करना
app = Flask(__name__)

# 1. होम पेज राऊट (जब कोई वेबसाइट खोलेगा तो यह चलेगा)
@app.route('/')
def home():
    # यह templates फोल्डर से index.html को लोड करेगा
    return render_template('index.html')



# 3. API राऊट (भविष्य में लॉगिन/साइनअप का डेटा यहाँ आएगा)
@app.route('/api/auth', methods=['POST'])
def auth():
    data = request.get_json(silent=True) or {}
    # अभी के लिए हम सिर्फ सक्सेस मैसेज भेज रहे हैं। 
    # बाद में हम यहाँ असली डेटाबेस जोड़ेंगे।
    return jsonify({
        "status": "success", 
        "message": f"Hello Commander! Data received for {data.get('type')}"
    })

# Render सर्वर के लिए पोर्ट कॉन्फ़िगरेशन
if __name__ == '__main__':
    # Render अपने आप एक PORT देता है, नहीं तो डिफ़ॉल्ट 5000 इस्तेमाल होगा
    port = int(os.environ.get('PORT', 5000))
    # host='0.0.0.0' ज़रूरी है ताकि Render इसे बाहरी दुनिया को दिखा सके
    app.run(host='0.0.0.0', port=port, debug=False)
    
