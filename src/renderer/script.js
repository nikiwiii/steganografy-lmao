var imageLoader = document.getElementById("imageLoader");
imageLoader.addEventListener("change", handleImage, false);
var canvas = document.getElementById("imageCanvas");
var ctx = canvas.getContext("2d");
var messageInput = document.getElementById("message");

var textCanvas = document.getElementById("textCanvas");
var tctx = textCanvas.getContext("2d");
var currImageExtension = "jpg";
const correctImageExtensions = ["jpg", "png"];
//handle decoding
var decodeCanvas = document.getElementById("imageCanvas2");
var dctx = decodeCanvas.getContext("2d");
var imageLoader2 = document.getElementById("imageLoader2");
var worky = false
imageLoader2.addEventListener("change", handleImage2, false);

function handleImage(e) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var img = new Image();

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      const height = canvas.height
      textCanvas.width = img.width;
      textCanvas.height = img.height;
      tctx.font = height*0.05+"px Arial";
      var messageText = messageInput.value.length
        ? messageInput.value
        : "witam";
      tctx.fillText(messageText, height*0.03, height*0.07);
      ctx.drawImage(img, 0, 0);
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var textData = tctx.getImageData(0, 0, canvas.width, canvas.height);
      var pixelsInMsg = 0;
      pixelsOutMsg = 0;
      for (var i = 0; i < textData.data.length; i += 4) {
        if (textData.data[i + 3] !== 0) {
          if (imgData.data[i + 1] % 10 == 7) {
            //do nothing, we're good
          } else if (imgData.data[i + 1] > 247) {
            imgData.data[i + 1] = 247;
          } else {
            while (imgData.data[i + 1] % 10 != 7) {
              imgData.data[i + 1]++;
            }
          }
          pixelsInMsg++;
        } else {
          if (imgData.data[i + 1] % 10 == 7) {
            imgData.data[i + 1]--;
          }
          pixelsOutMsg++;
        }
      }
      console.log("pixels within message borders: " + pixelsInMsg);
      console.log("pixels outside of message borders: " + pixelsOutMsg);
      ctx.putImageData(imgData, 0, 0);
    };
    var imageExtension = e.target.files[0].name.split(".")[1];
    if (correctImageExtensions.includes(imageExtension)) {
      console.log("aaa");
      worky = true
      img.src = event.target.result;
    } else {
      worky = false
      window.NotificationUtils.showNotification(
        "Incorrect File Extension",
        "Incorrect File Extension - Try .jpg or .png"
      );
      return;
    }
  };
  reader.readAsDataURL(e.target.files[0]);
  currImageExtension = e.target.files[0].name.split(".")[1];
}

function handleImage2(e) {
  console.log("handle image 2");
  var reader2 = new FileReader();
  reader2.onload = function (event) {
    console.log("reader2 loaded");
    var img2 = new Image();
    img2.onload = function () {
      console.log("img2 loaded");
      decodeCanvas.width = img2.width;
      decodeCanvas.height = img2.height*0.1;
      dctx.drawImage(img2, 0, 0);
      var decodeData = dctx.getImageData(
        0,
        0,
        decodeCanvas.width,
        decodeCanvas.height
      );
      for (var i = 0; i < decodeData.data.length; i += 4) {
        if (decodeData.data[i + 1] % 10 == 7) {
          decodeData.data[i] = 0;
          decodeData.data[i + 1] = 0;
          decodeData.data[i + 2] = 0;
          decodeData.data[i + 3] = 255;
        } else {
          decodeData.data[i + 3] = 0;
        }
      }
      dctx.putImageData(decodeData, 0, 0);
    };
    img2.src = event.target.result;
  };
  reader2.readAsDataURL(e.target.files[0]);
}

function download() {
  if (worky) {
    const filename = "encoded." + currImageExtension;
    let lnk = document.createElement("a"),
      e;
    lnk.download = filename;
    let c = document.getElementById("imageCanvas");
    lnk.href = c.toDataURL();
    if (document.createEvent) {
      e = document.createEvent("MouseEvents");
      e.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent("onclick");
    }
  }
}
