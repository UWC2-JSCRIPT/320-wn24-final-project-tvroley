  - The public facing url: https://my-cards-2e97d.web.app/
  
  - a brief summary of your project:
      
      This is a new version of my website for displaying graded traded cards from different grading companies from the user's collection
    This new version uses React components and stores the cards in Firestore.  It also has multiple card collections using routes.
  
  - The answers to the following questions Fill out each of these with a few sentences (50 characters minimum):
  
  - What worked well in this project (what was easy/straightforward)?    
      Sorting the cards from the Firestore database seemed intimidating, but it was easy to implement.  Also, uploading the cards from JSON to Firestore.
  
  - What didn't work well (what was difficult to understand or parse)?
      The basic Firestore query I was using was getting all the database events and turning them into cards, so it would display deleted cards.  Also, deleting cards using the Firebase console, and then trying to understand when it updated the cards website.  Also, it wasn't easy to find documentation on Firestore error handling.  Trying to implement nested routing for the AddCard component was hard when I needed to pass the AddCard component multiple arguments.
  
  - What changes would you make to this project now that it's deployed?
      I would try to pass a complete card collection to less React components.
  
  - What would you improve and/or add to this project now that it's deployed?"
      Different logins for different collections, nested routes for adding to and editing collections, not having the uncle and grandpa collections hard coded.
