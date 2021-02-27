const socket = io();

//Elements
const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = $messageForm.querySelector("#message");
const $messageFormButton = $messageForm.querySelector('button[type="submit"]');
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar")

//Templates
const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $locationTemplate = document.querySelector("#location-template").innerHTML;
const $sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = ()=>{
  //new message elements
  const $newMessage = $messages.lastElementChild;

  //Height of the new message element
  const newMesasgeStyles = getComputedStyle($newMessage);
  const newMesageMargin = parseInt(newMesasgeStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMesageMargin;

  //Visible Height
  const visibleHeight = $messages.offsetHeight;

  //Height of messages container
  const containerHeight = $messages.scrollHeight;

  //how far have i scrolled
  const scrollOffset = $messages.scrollTop+visibleHeight;

  //are we not at the botton
  if(containerHeight - newMessageHeight <= scrollOffset){
    //move to botton
    $messages.scrollTop = $messages.scrollHeight;
  }

}


socket.on("message", (message) => {
  const html = Mustache.render($messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (message) => {
  const html = Mustache.render($locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on('roomData', ({room, users}) => {
  const  html = Mustache.render($sidebarTemplate, {room, users})
  $sidebar.innerHTML = html;
})


$messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //disable form
  $messageFormButton.setAttribute("disabled", "disabled");

  socket.emit("sendMessage", $messageFormInput.value, (error) => {
    //enable form
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }
    console.log("Message delivered.");
  });
  return false;
});

$sendLocationButton.addEventListener("click", (event) => {
  const geo = navigator.geolocation;
  if (!geo) {
    return alert("Geolocation is not supoort by your browser.");
  }

  $sendLocationButton.setAttribute("disabled", "disabled");

  geo.getCurrentPosition((position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    socket.emit("sendLocation", location, (error) => {
      if (error) {
        console.log(error);
      }
      $sendLocationButton.removeAttribute("disabled");
      console.log("location shared...");
    });
  });
});

console.log('calling join',username, room)

socket.emit("join", { username, room }, (error) => {
  if(error){
    alert(error);
    location.href='/';
  }

});
