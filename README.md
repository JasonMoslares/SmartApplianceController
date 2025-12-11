🏠 Smart Appliance Controller

URL: https://smarthome-frontend-04ix.onrender.com

Contact me:

jasonraym8@gmail.com

so that I can run web services.

You can make an account or LOG IN with this credentials:

Email: jason@email.com

Pass: 1234

Here are the list of appliances that can be added:

Light: L001, L002, L003

Fan: M001, M002, M003

Speaker: S001, S002, S003

\*DISCLAIMER: I'm using free tier of Render, and Avien MySQL, please be patient with the website.

This Smart Appliance Controller gives users the ability to control their respective smart appliances through this web application.

📦 Prerequisites

Install Node.js
Install other dependencies
Open XAMPP, start Apache and MySQL, then click "Admin" of MySQL
In MySQL, create a database and name it "smart_home"

Create a table named "appliances", and add 6 columns, namely "user_id", "appliance_id", "appliance_name", "appliance_img", "appliance_room", "appliance_status"
Make sure to set the default value of appliance_status to "off"

Create another table named "device_catalog", and add 2 columns, namely "appliance_id", "appliance_type"
This table should already store all devices you intend to use, and make sure their appliance_id is unique.

Create another table named "users", and add 4 columns, namely "user_id", "name", "email", "password"
Make sure AUTO INCREMENT is checked on user_id column

⚙️ Functionality

💡 Smart Light

Click the pallette icon 🎨 to open color picker
Select your desired color and press the close icon to minimize color picker

💨 Smart Fan

Select a button among the three buttons for various speeds.
Number 1 being the slowest and 3 being the fastest.

🔊 Smart Speaker

Click "+" to increase frequency or the tone.
Click "-" to decrease frequency or the tone.

⚠️ Hardware Deployment

I'm still working on making the hardware devices sync with the front end web controls. As of now, I cannot get the values to control the hardware devices with ESP32 as I do not know how to pass the JWT Token from website to ESP32.
