var fs = require('fs'),
    path = require('path'),
    Twit = require('twitter-api-v2').TwitterApi,
    config = require(path.join(__dirname, 'config.js'));

var T = new Twit(config);

function random_from_array(images){
  return images[Math.floor(Math.random() * images.length)];
}

function upload_random_image(images){
    console.log('Opening an image...');
    var image_path = path.join(__dirname, '/images/' + random_from_array(images));

    console.log('Uploading an image...');

    T.v1.uploadMedia(image_path).then(async function (media) {
        console.log('Image uploaded!');
        console.log('Now tweeting it...');
        return await T.v2.tweet({
            text: random_from_array(['#SmashBros #SmashBrosSP #スマブラSP #スマブラ画' ]),
            media: {media_ids: [media]}
            });
    }).then((data) => {
        console.log('Posted an image! Now deleteing...');
        fs.unlink(image_path, function(err){
        if (err){
            console.log('ERROR: unable to delete image ' + image_path);
        }
        else{
            console.log('image ' + image_path + ' was deleted');
        }         
        });
    }).catch(function(error) {
        console.log('ERROR:');
        console.log(error);
    });
}

fs.readdir(__dirname + '/images', function(err, files) {
  if (err){
    console.log(err);
  }
  else{
    var images = [];
    files.forEach(function(f) {
      images.push(f);
    });

    setInterval(function(){
      upload_random_image(images);
    }, 1000 * 60 * 30);
  }
});
