document.getElementById("validIngredient").innerHTML = "";
document.getElementById("validDate").innerHTML = "";

//DATE + TIME
var weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July', 'August', 'September', 'October', 'November', 'December'];
var date = new Date();
var min = date.getMinutes();
var time = `${date.getHours()}:${(min < 10 ? '0' + min : min)}`;
var date_str = `${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;

document.getElementById("date").innerHTML = date_str;
document.getElementById("time").innerHTML = time;

//REMOVING NOTIFICATIONS
function removeNotif(_this) {
  _this.parentNode.removeChild(_this);
}
//ADDING NOTE
function addNote() {
  var notesList = document.getElementById("notesList");

  $("#notes").append("<form id=\"form\" onsubmit=\"addNoteHelper(); return false;\" ><input type=\"text\" id=\"newNote\" value=\"\"></form>")
}
function addNoteHelper() {
  newNote = document.getElementById("newNote").value;
  notesList.innerHTML += "<li class=\"list-group-item\">" + newNote + "<i class=\"fas fa-trash\" style=\"float: right\" onclick=\"removeNotif(this.parentElement)\"></i></li>";
  var f = document.getElementById("form");
  f.parentNode.removeChild(f);
}
//VIEWING INGREDIENTS
function displayIngredients(elt) {
  document.getElementById("food-groups").style.display = "none";
  if (elt.id == "all-btn") {
    document.getElementById("ingredientsList").style.display = "block";  
    document.getElementById("dairyList").style.display = "none";
  } else {
    document.getElementById("ingredientsList").style.display = "none";
    document.getElementById("dairyList").style.display = "block";
  }
}
$("#dairy-btn").click(function() {
  $("#addIngredient").text("ADD DAIRY");
});
$("#backIngredients").click(function() {
  $("#addIngredient").text("ADD ITEM");
});
function backToIngredients() {
  document.getElementById("food-groups").style.display = "block";
  document.getElementById("ingredientsList").style.display = "none";
  document.getElementById("dairyList").style.display = "none";
}
//ADD INGREDIENT
function addIngredient() {
  var table = document.getElementById("ingredientsTable");
  var tbody = table.children[1];
  var newRow = document.createElement("tr");
  var ingredient = document.createElement("td");
  var expr_date = document.createElement("td");
  var remove = document.createElement("td");
  remove.classList.add("removeIngredient");
  remove.onclick = function() {removeIngredient(this);}
  remove.id = tbody.children.length;
  newRow.appendChild(ingredient);
  newRow.appendChild(expr_date);
  newRow.appendChild(remove);
  var date = document.getElementsByName("expr_date")[0].value.split("-");

  var month = `${date[1]}`;
  var day = `${date[2]}`;
  var year = `${date[0]}`;
  var validDate = true;
  var validName = true;

  if (month == "" || day == "" || year == "" || parseInt(month) > 12 || parseInt(day) > 31 || parseInt(year) > 2019) {
    document.getElementById('validDate').innerHTML = "<i style=\"color: grey\">Please provide a valid expiration date</i>";
    validDate = false;
  }
  if (document.getElementsByName("name")[0].value == "") {
    document.getElementById('validIngredient').innerHTML = "<i style=\"color: grey\">Please provide a name for the item</i>";
    validName = false;
  }
  
  if (validDate == false && validName == true) {  
    document.getElementById('validDate').innerHTML = "<i style=\"color: grey\">Please provide a valid expiration date</i>";
    document.getElementById('validIngredient').innerHTML = "";
  } else if (validDate == true && validName == false) {
    document.getElementById('validIngredient').innerHTML = "<i style=\"color: grey\">Please provide a name for the item</i>";
    document.getElementById('validDate').innerHTML = "";
  } else {
    ingredient.innerHTML = document.getElementsByName("name")[0].value;
    expr_date.innerHTML = `${date[1]}-${date[2]}-${date[0]}`;
    remove.innerHTML= '<i class="fas fa-trash"></i>';
    tbody.appendChild(newRow);
    document.getElementsByName("name")[0].value = "";
    document.getElementsByName("expr_date")[0].value = "";
    updateRecipes();

    document.getElementById('validDate').innerHTML = "";
    document.getElementById('validIngredient').innerHTML = "";
  }
}
//REMOVE INGREDIENTS
function removeIngredient(elt) {
  var table = document.getElementById("ingredientsTable");
  table.children[1].children[elt.id].style.display = "none";
}
//VIEW RECIPES
function displayRecipes(elt) {
  document.getElementById("recipe-options").style.display = "none";
  document.getElementById("backRecipes").style.display = "block";
  if (elt.id == "all-recipes") {
    document.getElementById("allRecipesList").style.display = "block";  
    document.getElementById("favRecipesList").style.display = "none";
  } else {
    document.getElementById("allRecipesList").style.display = "none";
    document.getElementById("favRecipesList").style.display = "block";
  }
}
function backToRecipes() {
  document.getElementById("backRecipes").style.display = "none";
  document.getElementById("recipe-options").style.display = "block";
  document.getElementById("allRecipesList").style.display = "none";
  document.getElementById("favRecipesList").style.display = "none";
}

//SETTINGS
var slider = document.getElementById("tempInput");
var sliderOutput = document.getElementById("tempOutput");
sliderOutput.innerHTML = slider.value;

slider.oninput = function() {
  sliderOutput.innerHTML = this.value;
}

// Add modal to array of pop ups
var pops = [];
pops.push(document.getElementById('pbj'));
pops.push(document.getElementById('scamp'));
pops.push(document.getElementById('hamburger'));
//exampleModal is used for the add ingredients modal
//pops.push(document.getElementById('exampleModal'));
//we cant do the exampleModal because it will bug out the rest of the page
//since it takes in input, we cant simply make the display=none, we need to call 
//some other function.

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if(pops.includes(event.target)){
    event.target.style.display = "none";
  }
  //console.log(pops[0]);
}
//ADD TO SHOPPING CART
function addToCart(elt) {
  var confirmAdd = confirm(`Would you like to add ${elt.innerHTML} to shopping cart?`);
  if (confirmAdd) {
    var shoppingList = document.getElementById("shoppingList");
    var tbody = shoppingList.children[1];
    var newRow = document.createElement("tr");
    var td = document.createElement("td");

    td.innerHTML = elt.innerHTML + "<i class=\"fas fa-window-close\" style=\"float: right\" onclick=\"removeNotif(this.parentElement)\"></i>";
    newRow.appendChild(td);
    tbody.prepend(newRow);
  }
}
//CROSS REFERENCE RECIPE INGREDIENTS WITH ALL INGREDIENTS
function updateRecipes() {
  var table = document.getElementById("ingredientsTable");
  var tbody = table.children[1].children;
  var all_ingredients = []

  //get all the ingredients (grabbing from All Ingredients)
  for (let i = 0; i < tbody.length; i++) {
    all_ingredients.push(tbody[i].children[0].textContent);
  }

  //grab all recipe ingredients
  var recipeTable = document.getElementById("allRecipesTable");
  var tbody = recipeTable.children[0].children;
  var recipes = []
  for (let i = 0; i < tbody.length; i++) {
    //console.log(recipeTable.children[0].children[i].getAttribute("name"));
    if (recipeTable.children[0].children[i].getAttribute("name")) {
      recipes.push(recipeTable.children[0].children[i].getAttribute("name"));
    }
  }

  var recipeIngredients;
  for (let i = 0; i < recipes.length; i++) {
    var curr_recipe = document.getElementById(recipes[i]);
    var curr_recipe_ingredients = []
    var hasAllIngredients = true;

    //console.log(curr_recipe.children[0].children[1].children[0].children[4].getElementsByTagName("li").length);
    var numIngredients = curr_recipe.children[0].children[1].children[0].children[4].getElementsByTagName("li").length;
    for (let j = 0; j < numIngredients; j++) {
      //console.log(curr_recipe.children[0].children[1].children[0].children[4].children[j].textContent);
      //console.log(curr_recipe.children[0].children[1].children[0].children[5].children[0]);
      //get each ingredient for this recipe
      curr_recipe_ingredients.push(curr_recipe.children[0].children[1].children[0].children[4].children[j].textContent);

      if (!all_ingredients.includes(curr_recipe_ingredients[j])) {
        hasAllIngredients = false;
      }
    }
    //console.log(curr_recipe_ingredients);
    //If all a recipe's ingredients are in inventory, change the recipe to "makeable"  
    if (hasAllIngredients == true) {
      for (let x = 0; x < numIngredients; x++) {
        var prnt = curr_recipe.children[0].children[1].children[0].children[4].children[x].children[0].className;
        curr_recipe.children[0].children[1].children[0].children[4].children[x].children[0].className = "makeable";
        var prnt = curr_recipe.children[0].children[1].children[0].children[4].children[x].children[0].className;

        //This section is for the regular fridge, the above part modfied the mobile <ul>
        //This one will modify recipeIngredientsFridge class
        curr_recipe.children[0].children[1].children[0].children[5].children[0].children[x].children[0].className = "makeable"
        //console.log(curr_recipe.children[0].children[1].children[0].children[5].children[0].children[x].children[0].className);
        //console.log(prnt);
      }
      //The above code sets the text inside the modal to be green(makeable)
      //This portion is to set the recipe text inside the recipe tab, to green if makeable.
      //console.log(curr_recipe.id);
      var t1 = document.getElementsByName(curr_recipe.id);
      //console.log(t1[0].className);
      t1[0].className = "makeable";
      console.log(t1[0]);

      var rdy = document.getElementById("favRecipesList");
      console.log(rdy.children[1].children[0].children[0].children[0]);

      var cloned = t1[0].cloneNode(true);
      var quick = document.getElementById("quick-table");

      rdy.children[1].children[0].children[0].children[0].appendChild(t1[0]);
      quick.children[0].prepend(cloned)
      //console.log(quick.children[0]);

      var art = document.getElementById("allRecipesTable");
      //art.children[0].prepend(cloned);
    }
    /*
    else{
      var tempy = document.getElementById("allRecipesTable");
      var t1 = document.getElementsByName(curr_recipe.id);
      console.log(t1);
      tempy.children[0].appendChild(t1[0]);
    }
    */
    
    //recipeIngredients[i][curr_ingredients];
  }  
}

function firstload(){
  updateRecipes();
}

/* Update username in Settings */
function changeUserName() {
  let newUserName = document.getElementById("newUserName").value;
  let usernameDisplay = document.getElementById("userName");
  let notif = document.getElementById("nameChangeNotif");

  if (newUserName != usernameDisplay.innerHTML) {
    usernameDisplay.innerHTML = newUserName;
    notif.innerHTML = "<i>Name changed successfully</i>"
  } else {
    notif.innerHTML = ""
  }
}
$(document).ready(function(){
  $('[data-toggle="popover"]').popover();   
});