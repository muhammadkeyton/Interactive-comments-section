
//chooses randomly a profile photo for the user signing up

const profilePhotos = ["images/avatars/image-amyrobson.png","images/avatars/image-juliusomo.png","images/avatars/image-maxblagun.png","images/avatars/image-ramsesmiron.png"]

var n = Math.random()
var n = Math.floor(n*4);

module.exports = profilePhotos[n];
