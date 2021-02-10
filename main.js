//Code that I have not written
let buttonenabled = true, scroll = 0;
$(document).on("click", ".darkmode", function(){
	if(!buttonenabled) return;
	buttonenabled = false;
	$(".clip").html($("body >.container")[0].outerHTML); //Copy container to inside clip
	scrollbind($(".clip .container"));
	$(".clip .container").toggleClass("dark").scrollTop(scroll); //Toggle dark mode and set scroll
	$(".clip .darkmode").toggleClass("fa-moon").toggleClass("fa-sun"); //Make changes: change button icon
	$(".clip").addClass("anim"); //Animate the clip
	setTimeout(function(){
		$("body >.container").replaceWith($(".clip").html()) //Replace container with clip html
		scrollbind($("body >.container")); //bind scroll with new container
		$("body >.container").scrollTop(scroll); //Set scroll position
		$(".clip").html("").removeClass("anim"); //Hide clip
		buttonenabled = true;
	}, 1000); //Slightly before animation finishes but when the circle will have covered the screen, gives us 500ms to make the changes we need which is plenty. Slower computers will not see a flash, but elements may not have loaded - if it really is an issue delay line 19 a little
});

const scrollbind = el => el.bind("scroll", function(){
	scroll = $(this).scrollTop();
	if($(".container").length > 1) //No point setting it if there is only 1
		$(".container").scrollTop(scroll); 
		//This will set the scroll position of the container inside the clip so it scrolls while the animation is being carried out
});
scrollbind($(".container"));

img = "";
status = "";
objects = [];

function preload() {
    img = loadImage('test.jpg');
}

function setup() {
    canvas = createCanvas(640, 420);
    canvas.center();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting objects";
}

function draw() {
    image(img, 0, 0, 640, 420);
    
    if (status != "") {
        for (var i = 0; i <= objects.length-1; i++) {
            document.getElementById("status").innerHTML = "Status : Object Detected";
            fill("red");
            noFill();
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " "+percent+"%", objects[i].x + 15, objects[i].y + 15);
            stroke("red");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            
        }
    }
}

function modelLoaded() {
    console.log("Model Loaded");
    status = true;
    objectDetector.detect(img, gotResult);
}

function gotResult(error, results) {
    if(error){
        console.error(error);
    }else{
        console.log(results);
        objects = results;
    }
}