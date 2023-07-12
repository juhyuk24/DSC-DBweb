function patchinnerHTML() {
    var divHTML = document.getElementsByClassName("inner-space");
    divHTML.innerHTML = "<div href='index.html'> dfd</div>";
    console.log(divHTML.innerHTML);
}