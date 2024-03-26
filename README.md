<h1>Meerkat app</h1>

<h2>Description</h2> 
<p>Meerkat is an app to test node, mongodb(Mongoose), express, ejs, and other aspects of development. In this scenario, this application is developed to enable the user to save its favorite Audiovisuals. This category gathers movies, series, documentaries and others type of productions similar to these ones.Also the user can make reviews about these audiovisuals in the application.            
The app is the result of a course in Udemy, which is taught by Colt Steele. The name of the course is <strong>The Web Developer Bootcamp 2024.</strong></p>

<h2>Installation</h2>
<h3>Main install</h3>
Be sure to have NodeJS installed in your system, then:
<ul>
  <li>
    git clone this repository
  </li>
  <li>
    npm i
  </li>
  <li>
    npm start
  </li>
</ul>

<h3>Docker option</h3>
Also if you prefer you can use the docker:
First git clone this repository, then go to the directory of the application and:
    
  ``` docker build -t meerkat . ```

  ```docker run -p 3000:3000 meerkat```
  

Finally the port is set to 3000, so go to some browser and put ```localhost:3000```

