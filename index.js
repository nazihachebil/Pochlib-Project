
// Book Class: Represents a Book
class Book {
  constructor (title,isbn,author,description,image){
      this.title=title;
      this.isbn=isbn;
      this.author=author;
      this.description=description;
      this.image=image;
  }
}

// Add a Book Event
function showForm() {
  document.getElementById("book-form").style.display = "block";
  document.getElementById("add-button").style.display = "none";
  
}

// Submit research Book
$(document).ready(function(){
  var bookUrl='';
  var bookImg1,bookIsbn1,bookTitle1,bookAuthor1,bookDescription1;
  $('#book-form').submit(function(){
   var searTitle=$("#title").val();
   var searAuthor=$("#author").val();
   var search=searTitle+searAuthor;
   console.log(search);
   if(searAuthor != '' && searTitle =='')
   {
      alert("Donnez s'il vous plait le titre de livre");
   }
   else if(searTitle != '' && searAuthor == ''){
      alert("Donnez s'il vous plait l'auteur de livre");
   }
   else if(search == '')
   {
       alert("Donnez s'il vous plait le titre de livre et son auteur");
   }
   else{
      document.getElementById("book-list").style.display = "block";
      $.get("https://www.googleapis.com/books/v1/volumes?q=" + search, function(response){
         console.log(response.items)
          if(response.items==null)
          {
              alert("Aucun livre n’a été trouvé");
          }
          else{
              
              displayResults(response);
          }
     });
   }
   return false;
  
});

// function to display results in index.html
function displayResults(response){

  var outputList= document.getElementById("result-research");
  
  outputList.innerHTML='';
  for(var i=0;i<response.items.length;i++)
  {
      item1=response.items[i];
      bookTitle1=item1.volumeInfo.title;
      if(item1.volumeInfo.industryIdentifiers==null){
         bookIsbn1='Information manquante';
      }
      else{
         bookIsbn1=item1.volumeInfo.industryIdentifiers[0].identifier;
      }
      if(item1.volumeInfo.authors==null)
      {
          bookAuthor1='Information manquante';
      }
      else{
          bookAuthor1=item1.volumeInfo.authors[0];
      }
      if(item1.volumeInfo.description==null)
      {
          bookDescription1='Information manquante';
      }
      else{
          bookDescription1=(item1.volumeInfo.description).substring(0,200);
      }
      if(item1.volumeInfo.imageLinks==null)
      {
          bookImg1="/image/unavailable.png";
      }
      else{
          bookImg1=item1.volumeInfo.imageLinks.thumbnail;
      }
      outputList.innerHTML += "<div class='col-sm-12 col-sm-6 col-md-6 col-style'>"+
          formatOutput(bookImg1,bookTitle1,bookAuthor1,bookIsbn1,bookDescription1)+
          "</div>";
  }
}

});

//Template for bootstrap cards
function formatOutput(bookImg,bookTitle,bookAuthor,bookIsbn,bookDescription){
  var htmlCard = '';
  htmlCard = `
  <div class="card thumb h-100 w-100 bg-light border-dark mb-3"  id='${bookIsbn}' >
    
        <div class="card-body text-dark">
          <h4> 
            <button type="button" class="btn btn-default" style="float:right;" bookTitle="${bookTitle}" bookDescription="${bookDescription}" bookImg="${bookImg}"
            onClick="clickBookMark('${bookIsbn}','${bookAuthor}',this.getAttribute('bookTitle'),this.getAttribute('bookDescription'),this.getAttribute('bookImg'))">
              <span id="collapse-${bookIsbn}"  class="material-icons-outlined iconcolor" style="float:right;" >bookmark</span>
           </button>
         </h4>
          <h5 class="card-title titl-card" id="booTit">Titre: ${bookTitle}</h5>
          <p class="card-text text-Card id-style" id="booIsb">Id: ${bookIsbn}</p>
          <p class="card-text text-Card" id="booAut">Auteur: ${bookAuthor}</p>
          <p class="card-text text-Card" id="booDesc" >Description: ${bookDescription}</p>
          <p class="card-text text-Card">  </p>
          <p > 
            <center>
               <img src="${bookImg}" id="booIm" class="card-img-top im-style" alt="Card image cap">
            </center>
          </p>
        </div>
      
    </div>`
 return htmlCard;
}

//Click Bookmark Function
function clickBookMark(bookIsbn, bookAuthor,bookTitle,bookDescription,bookImg) {

var idTitl=bookTitle.substring(0,10);
document.getElementById('collapse-'+bookIsbn).innerHTML='bookmark_added';

//Instantiate book
const mybook=new Book();
mybook.title=bookTitle;
mybook.isbn=bookIsbn;
mybook.author=bookAuthor;
mybook.description=bookDescription;
mybook.image=bookImg;

const check=Store.findBook(mybook.isbn);
if(check==false){
  //Add Book To Store 
   Store.addBook(mybook); 
   addBookToList(mybook);
}
else{
   alert("Vous ne pouvez ajouter deux fois le même livre");
}

}

// Store class: Handles Storage
class Store{
  static getBooks(){
    let books;
    if(localStorage.getItem('books')===null){
        books=[];
    }else{
        books= JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  static addBook(book){
     const books=Store.getBooks();

     books.push(book);

     localStorage.setItem('books',JSON.stringify(books));
  }
  static removeBook(isbn){
     const books=Store.getBooks();
     books.forEach((book,index) =>{
         if(book.isbn ===isbn){
             books.splice(index,1);
         }
     });

     localStorage.setItem('books',JSON.stringify(books));
  }
  static findBook(isbn){
    const books=Store.getBooks();
    var existLocalstore=false;
    
    for(var bo=0;bo<books.length;bo++)
    {
         if(books[bo].isbn ===isbn){
           existLocalstore=true;
           break;
         }
    }
    
    return existLocalstore;
  }
}

//Display books in PochList
function displayBookPoch(){

const books=Store.getBooks();

books.forEach((book) => addBookToList(book));

}
// Add Book To Pochlist
function addBookToList(book) {

 var outputList1= document.getElementById("poch-list");
  var bookImg2,bookTitle2,bookAuthor2,bookIsbn2,bookDescription2;

  bookTitle2=book.title;
  bookIsbn2=book.isbn;
  bookAuthor2=book.author;
  bookDescription2=book.description;
  bookImg2=book.image;
  
  if(outputList1.innerHTML!='')
  {
    outputList1.innerHTML += "<div class='col-sm-12 col-sm-6 col-md-6  col-style'>"+
    formatOutput1(bookImg2,bookTitle2,bookAuthor2,bookIsbn2,bookDescription2)+
    "</div>";
  }
  else{
       outputList1.innerHTML='';
       outputList1.innerHTML += "<div class='col-sm-12 col-sm-6 col-md-6  col-style'>"+
          formatOutput1(bookImg2,bookTitle2,bookAuthor2,bookIsbn2,bookDescription2)+
          "</div>";
  }

}

//Template for bootstrap cards for PochList
function formatOutput1(bookImg,bookTitle,bookAuthor,bookIsbn,bookDescription){
var htmlCard='';
  htmlCard = `
  <div class="card thumb h-100 w-100 bg-light border-dark mb-3"  id='${bookIsbn}' >
    
        <div class="card-body text-dark">
          <h4> 
             <button type="button" class="btn btn-default" style="float:right;" onClick="clickdelete('${bookIsbn}')">
                
                <span class="material-icons-outlined" style="float:right;">delete</span>
             </button>
          </h4>
          <h5 class="card-title titl-card" >Titre: ${bookTitle}</h5>
          <p class="card-text text-Card id-style">Id: ${bookIsbn}</p>
          <p class="card-text text-Card">Auteur: ${bookAuthor}</p>
          <p class="card-text text-Card">Description: ${bookDescription}</p>
          
          <p> 
            <center>
               <img  src=${bookImg} class="card-img-top im-style" alt="Card image cap">
            </center>   
          </p>
        </div>
    
  </div>`
   
  return htmlCard;
}

//Click Bookmark Function
function clickdelete(itemIsbn) {

 //delete Book from Pochlist
  var itemToRemove = document.getElementById(itemIsbn);
  itemToRemove.parentNode.removeChild(itemToRemove);
  //delete Book from Store 
 Store.removeBook(itemIsbn); 
}

//Event:display Books
document.addEventListener('DOMContentLoaded',displayBookPoch);

