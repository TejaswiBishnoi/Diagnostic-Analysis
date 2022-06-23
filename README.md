# Diagnostic-Analysis

A web application designed to perform analytics on stream of data from embedded devices.The report is presented in the form of charts and line graphs along with descriptive texts.
<br>

<h1>Technologies Used</h1>
<ul>
  <li>JavaScript</li>
  <li>Node js</li>
  <li>React js</li>
  <li>ReGraphs</li>
  <li>Express</li>
  <li>Multer</li>
</ul>

<br>

<h1>Key Features</h1>
<ul>
  <li><h3>Efficient searching and storage:</h3>
    The file is read <b>only once</b> and the data is stored according to the timestamps in the <b>HashMaps</b>. This provides <b>logarithmic time</b> searching and <b>linear time</b> extraction of data. Whenever a time based query is asked by the user, the program iterates in the mapping to provide the data which fits the user constraints.
  </li>
  <li><h3>RegEx based search</h3>
    A regular expression is a form of advanced searching that looks for <b>specific patterns</b>. Hence RegEx you can use pattern matching to search for particular strings of characters rather than constructing multiple, literal search queries. Thus the search is more elegant and efficient.
  </li>
  <li><h3>Flexible and fast backend:</h3>
    The server is run using <b>express</b>. It enhances the functionality of Node js and makes API development, routing, making HTTPS requests easy. 
    The backend is based on Node js, thus data processing and client-server interaction, development, and progression and all carried out at a faster rate. Both these technologies allow JavaScript to be used for both frontend and the backend.
  </li>
  <li>
    <h3>React based frontend:</h3>
    React provides <b>faster rendering</b> by the use of virtual DOM and has a wide variety of developer tools. <b>Bootstrap</b> provides high end designs and thus makes the web application more interactive and appealing to the user.
  </li>
  <li><h3>ReGraph: </h3>
    ReGraph is a react toolkit for graph visualisation. The service allows for Automatic Data, Network Filtering, Custom Styling and Time Based anlysis etc. Thus was fit for developing interactive graphs.
  <li><h3>RAM based storing</h3>
    Multer provides the option for the file to be stored on RAM or on the local disk, thus creating a double copy. We have thus opted for the RAM based temporary storage hence creating a use-and-throw based service system thus allowing space optimisation and faster read write.
    </li>
 
 
 <br>
  
  <h1>Usage</h1>
  <ol>
    <li>Visit the web application and proceed to upload the .log file you want to analyze</li>
    <li><b>Specify the parameters</b> to be plotted on the graph from the <b>dropdown</b> menu. </li>
    <li>Assign the <b>timestamp contraint</b>, i.e. the time between which you want to anlyze the parameters.</li>
     <li>The graph will be made in the selected form (histogram, pie chart etc.). The user can add more graph type according to their needs.</li>
  </ol>
    
  
