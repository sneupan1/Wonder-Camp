var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comments");

var data =[
	{
		name: "Cloud's Rest",
		image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
		description: "Bacon ipsum dolor amet shank burgdoggen alcatra jowl beef chuck cupim boudin pastrami chicken leberkas pork loin turducken. Burgdoggen boudin shankle, pork belly salami pork loin leberkas porchetta short loin turducken. Jerky ribeye doner leberkas jowl tenderloin kielbasa strip steak landjaeger pork belly beef brisket. Ham prosciutto capicola turkey, cupim brisket short ribs tail salami strip steak tongue shank jowl. Salami ribeye pork jowl shoulder porchetta pork loin doner drumstick tri-tip bacon."
	}, 
	{
		name: "Desert Mesa",
		image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
		description: "Bacon ipsum dolor amet shank burgdoggen alcatra jowl beef chuck cupim boudin pastrami chicken leberkas pork loin turducken. Burgdoggen boudin shankle, pork belly salami pork loin leberkas porchetta short loin turducken. Jerky ribeye doner leberkas jowl tenderloin kielbasa strip steak landjaeger pork belly beef brisket. Ham prosciutto capicola turkey, cupim brisket short ribs tail salami strip steak tongue shank jowl. Salami ribeye pork jowl shoulder porchetta pork loin doner drumstick tri-tip bacon."
	}, 
	{
		name: "Canyon Floor",
		image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
		description: "Bacon ipsum dolor amet shank burgdoggen alcatra jowl beef chuck cupim boudin pastrami chicken leberkas pork loin turducken. Burgdoggen boudin shankle, pork belly salami pork loin leberkas porchetta short loin turducken. Jerky ribeye doner leberkas jowl tenderloin kielbasa strip steak landjaeger pork belly beef brisket. Ham prosciutto capicola turkey, cupim brisket short ribs tail salami strip steak tongue shank jowl. Salami ribeye pork jowl shoulder porchetta pork loin doner drumstick tri-tip bacon.h"
	}
]

function seedDB() {
	//remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		} else {
			console.log("removed campgrounds!");
			Comment.remove({}, function(err){
				if(err){
					console.log(err);
				} else {
					console.log("removed comments");
				}
			});
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err){
						console.log(err);
					} else{
						console.log("added a campground");
						//create a comment
						Comment.create(
							{
								text: " This place is great but I wish tere was internet",
								author: "Homer"
							},function(err, comment) {
								if(err){
									console.log(err);
								} else {
									campground.comments.push(comment);
									campground.save();
									console.log("Created New Comment");
								}
								
							}
						)
					}
				});
			});
		}
	});
	
}

module.exports = seedDB;